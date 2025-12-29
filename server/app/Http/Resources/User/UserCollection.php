<?php

namespace App\Http\Resources\User;

use Illuminate\Http\Resources\Json\JsonResource;

class UserCollection extends JsonResource
{
    public function toArray($request)
    {
        if (!empty($this->items)) {
            return [];
        }

        $array = [
            'id'          => $this->id,
            'name'        => $this->name,
            'phone'       => $this->phone,
            'image'            => $this->whenLoaded('image', function () {
                return $this->image;
            }),
            'dob'         => $this->dob,
            'roleId'      => $this->roleId,
            'gender'      => $this->gender,
            'provinceId'  => $this->province_id,
            'districtId'  => $this->district_id,
            'wardId'      => $this->ward_id,
            'address'     => $this->address,
            'email'       => $this->email,
            'password'    => $this->password,
            'active'      => $this->active,
            'createdAt'   => $this->created_at,
            'updatedAt'   => $this->updated_at,
        ];

        return $array;
    }
}
