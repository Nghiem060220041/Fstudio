<?php

namespace App\Http\Requests\Admin\Customer;

use Illuminate\Contracts\Validation\Validator;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Http\Exceptions\HttpResponseException;
use Illuminate\Validation\Rule;
use Illuminate\Support\Str;

class UpdateRequest extends FormRequest
{
    public function authorize()
    {
        return true;
    }

    public function rules(): array
    {
        $rules = [
            'name'   => 'required|max:191',
            'email'   => [
                'required',
                'string',
                'email',
                'max:60',
                'regex:/^([a-z0-9_-]+)(\.[a-z0-9_-]+)*@([a-z0-9_-]+\.)+[a-z]{2,6}$/ix',
                Rule::unique('customers', 'email')->where(function ($query) {
                    $query->whereNull('deleted_at')->where('email', $this->email)->whereRaw('BINARY LOWER(email) = ?', [Str::lower($this->email)]);
                })->ignore($this->customer),
            ],
            'phone'   => [
                'required',
                'min:10',
                'max:15',
                'regex:/^[0-9-]+$/',
                Rule::unique('customers', 'phone')->where(function ($query) {
                    $query->whereNull('deleted_at')->where('phone', $this->phone)->whereRaw('BINARY LOWER(phone) = ?', [Str::lower($this->phone)]);
                })->ignore($this->customer),
            ],
        ];

        return $rules;
    }

    public function failedValidation(Validator $validator)
    {
        throw new HttpResponseException(response()->json([
            'statusCode' => 400,
            'data'       => $validator->errors()
        ], 400));
    }
}
