<?php

namespace App\Http\Requests\Auth\Client;

use Illuminate\Contracts\Validation\Validator;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Http\Exceptions\HttpResponseException;
use Illuminate\Validation\Rule;
use Illuminate\Support\Str;

class RegisterRequest extends FormRequest
{
    public function authorize()
    {
        return true;
    }

    public function rules()
    {
        return [
            'name' => [
                'required',
                'min:6',
                'max:60'
            ],
            'email' => [
                'required',
                'string',
                'email',
                'max:60',
                'regex:/^([a-z0-9_-]+)(\.[a-z0-9_-]+)*@([a-z0-9_-]+\.)+[a-z]{2,6}$/ix',
                Rule::unique('customers', 'email')->where(function ($query) {
                    $query->whereNull('deleted_at')->where('email', $this->email)->whereRaw('BINARY LOWER(email) = ?', [Str::lower($this->email)]);
                }),
            ],
            'phone' => [
                'required',
                'min:10',
                'max:15',
                'regex:/^[0-9-]+$/',
                Rule::unique('customers', 'phone')->where(function ($query) {
                    $query->whereNull('deleted_at')->where('phone', $this->phone);
                }),
            ],
            'password' => ['required', 'string'],
        ];
    }

    public function failedValidation(Validator $validator)
    {
        throw new HttpResponseException(response()->json([
            'statusCode' => 400,
            'data'       => $validator->errors()
        ], 400));
    }
}
