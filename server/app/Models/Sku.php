<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Sku extends Model
{
    use HasFactory;

    const TABLE = 'skus';
    protected $table = self::TABLE;
    protected $fillable = [
        'sku',
        'product_id',  
        'quantity', 
        'sold_quantity', 
        'price', 
        'is_discount', 
        'type_discount', 
        'percent_discount', 
        'price_discount'
    ];
    public $timestamps = true;

    public function product()
    {
        return $this->belongsTo(Product::class);
    }

    public function propertyOptions()
    {
        return $this->belongsToMany(PropertyOption::class);
    }
}
