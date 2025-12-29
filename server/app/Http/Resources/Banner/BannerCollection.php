<?php

namespace App\Http\Resources\Banner;

use Illuminate\Http\Resources\Json\JsonResource;

class BannerCollection extends JsonResource
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
            'position'         => $this->name,
            'active'           => $this->active,
            'description'      => $this->description,
            'createdAt'        => $this->created_at,
            'updatedAt'        => $this->updated_at,
        ];

        return $array;
    }
}
