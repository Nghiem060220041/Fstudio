<?php

namespace App\Http\Resources\Images;

use Illuminate\Http\Resources\Json\JsonResource;

class ImagesCollection extends JsonResource
{
    public function toArray($request)
    {
        if (!empty($this->items)) {
            return [];
        }

        $array = [
            'id'               => $this->id,
            'imageable_id'     => $this->imageable_id,
            'path'             => $this->path,
            'imageable_type'   => $this->imageable_type,
            'createdAt'        => $this->created_at,
            'updatedAt'        => $this->updated_at,
        ];

        return $array;
    }
}
