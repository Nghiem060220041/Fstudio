<?php

namespace App\Http\Requests\Admin\Coupon;

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
            'code'   => [
                'required',
                Rule::unique('coupons', 'code')->where(function ($query) {
                    $query->where('code', $this->code)->whereRaw('BINARY LOWER(code) = ?', [Str::lower($this->code)]);
                })->ignore($this->coupon),
            ]
        ];

        if($this->type==0){
            $rules[] = [
                'value'  => 'required|numeric|max:100|min:1',
            ];
        }else{
            $rules[] = [
                'value'  => 'required|numeric|max:100000000|min:1',
            ];
        }

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
