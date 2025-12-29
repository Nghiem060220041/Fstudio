<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Order extends Model
{
    use HasFactory;
    const TABLE = 'orders';
    protected $table = self::TABLE;
    protected $fillable = [
        'customer_id',
        'description',
        'total',
        'order_id',
        'product_id',
        'sku_id',
        'quantity',
        'price',
        'status',
        'payment_type',
        'payment_at',
        'status_payment',
        'code',
        'coupon_id',
        'address',
    ];
    public $timestamps = true;

    public function orders()
    {
        return $this->hasMany(Order::class);
    }

    public function customer()
    {
        return $this->belongsTo(Customer::class)->withTrashed();
    }

    public function childrenOrders()
    {
        return $this->hasMany(Order::class)->with('orders', 'product', 'product.image', 'sku.propertyOptions');
    }

    public function product()
    {
        return $this->belongsTo(Product::class);
    }

    public function sku()
    {
        return $this->belongsTo(Sku::class);
    }
}
