<?php

namespace App\Http\Resources\Brand;

use Illuminate\Http\Resources\Json\JsonResource;

class BrandCollection extends JsonResource
{
    public function toArray($request)
    {
        if (!empty($this->items)) {
            return [];
        }

        $array = [
            'id'               => $this->id,
            'image'            => $this->whenLoaded('image', function () {
                return $this->image;
            }),
            'name'             => $this->name,
            'description'      => $this->description,
            'slug'             => $this->slug,
            'createdAt'        => $this->created_at,
            'updatedAt'        => $this->updated_at,
        ];

        return $array;
    }
}
