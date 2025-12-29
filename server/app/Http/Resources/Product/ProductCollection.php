<?php

namespace App\Http\Resources\Product;

use Illuminate\Http\Resources\Json\JsonResource;

class ProductCollection extends JsonResource
{
    public function toArray($request)
    {
        if (!empty($this->items)) {
            return [];
        }

        $array = [
            'id'               => $this->id,
            'sku'              => $this->sku,
            'skus'             => $this->skus,
            'name'             => $this->name,
            'image'            => $this->whenLoaded('image', function () {
                return $this->image;
            }),
            'brand_id'         => $this->brand_id,
            'category_id'      => $this->category_id,
            'many_version'     => $this->many_version,
            'quantity'         => $this->quantity,
            'sold_quantity'    => $this->sold_quantity,
            'price'            => $this->price,
            'is_discount'      => $this->is_discount,
            'type_discount'    => $this->type_discount,
            'percent_discount' => $this->percent_discount,
            'price_discount'   => $this->price_discount,
            'trending'         => $this->trending,
            'description'      => $this->description,
            'active'           => $this->active,
            'slug'             => $this->slug,
            'createdAt'        => $this->created_at,
            'updatedAt'        => $this->updated_at,
        ];

        return $array;
    }
}
