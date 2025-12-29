<?php

namespace App\Http\Resources\Order;

use Illuminate\Http\Resources\Json\JsonResource;

class OrderCollection extends JsonResource
{
    public function toArray($request)
    {
        if (!empty($this->items)) {
            return [];
        }

        $array = [
            'id'                    => $this->id,
            'customer_id'           => $this->customer_id,
            'customer'              => $this->customer,
            'product_id'            => $this->product_id,
            'order_id'              => $this->order_id,
            'sku_id'                => $this->sku_id,
            'quantity'              => $this->quantity,
            'price'                 => $this->price,
            'description'           => $this->description,
            'code'                  => $this->code,
            'coupon_id'             => $this->coupon_id,
            'address'               => $this->address,
            'createdAt'             => $this->createdAt,
            'paymentAt'             => $this->paymentAt,
            'status'                => $this->status,
            'payment_type'          => $this->payment_type,
            'status_code'           => $this->status_code,
            'status_payment'        => $this->status_payment,
            'status_payment_code'   => $this->status_payment_code,
            'status'                => $this->status,
            'class'                 => $this->class,
            'classType'             => $this->class_type,
            'classStatus'           => $this->class_status,
            'total'                 => $this->total,
            'filename'              => $this->filename,
        ];

        return $array;
    }
}
