<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Coupon extends Model
{
    use HasFactory;

    const TABLE = 'coupons';
    protected $table = self::TABLE;
    protected $fillable = [
        'name',
        'code',
        'type',
        'value',
        'value_max',
        'quantity',
        'quantity_used',
        'expired_at',
        'active',
        'description',
        'new_customer',
        'has_expired'
    ];
    public $timestamps = true;
}
