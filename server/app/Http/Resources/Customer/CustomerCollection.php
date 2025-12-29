<?php

namespace App\Http\Resources\Customer;

use Illuminate\Http\Resources\Json\JsonResource;

class CustomerCollection extends JsonResource
{
    public function toArray($request)
    {
        if (!empty($this->items)) {
            return [];
        }

        $array = [
            'id'               => $this->id,
            'image'            => $this->whenLoaded('image', function () {
                return $this->image->path;
            }),
            'name'             => $this->name,
            'provinceId'       => $this->province_id,
            'districtId'       => $this->district_id,
            'wardId'           => $this->ward_id,
            'address'          => $this->address,
            'phone'            => $this->phone,
            'email'            => $this->email,
            'active'           => $this->active,
            'createdAt'        => $this->created_at,
            'updatedAt'        => $this->updated_at,
        ];

        return $array;
    }
}
