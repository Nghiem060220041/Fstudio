<?php

namespace App\Http\Requests\Admin\Product;

use Illuminate\Contracts\Validation\Validator;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Http\Exceptions\HttpResponseException;

class CreateRequest extends FormRequest
{
    public function authorize()
    {
        return true;
    }

    public function rules(): array
    {
        $rules = [
            'name'          => 'required|max:191',
            'category_id'   => 'required|numeric',
            'brand_id'      => 'required|numeric',
            'price'         => 'nullable|numeric|min:0|max:10000000000',
            'quantity'      => 'nullable|numeric|min:0|max:1000000',
            'sold_quantity' => 'nullable|numeric|min:0|max:1000000',
            'active'        => 'required',
            'trending'      => 'required',
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
