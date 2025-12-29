<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class CustomerCoupon extends Model
{
    use HasFactory;

    const TABLE = 'customer_coupons';
    protected $table = self::TABLE;
    protected $fillable = ['coupon_id', 'customer_id'];
    public $timestamps = false;
}
