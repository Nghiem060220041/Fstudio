<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Product extends Model
{
    use HasFactory, SoftDeletes;

    const TABLE = 'products';
    protected $table = self::TABLE;
    protected $fillable = [
        'name', 
        'sku', 
        'many_version', 
        'quantity', 
        'sold_quantity', 
        'price', 
        'brand_id', 
        'category_id', 
        'is_discount', 
        'type_discount', 
        'percent_discount', 
        'price_discount', 
        'trending', 
        'description', 
        'slug', 
        'active'
    ];
    public $timestamps = true;

    public function image()
    {
        return $this->morphOne(Image::class, 'imageable');
    }

    public function relatedProducts()
    {
        return $this->hasMany(ProductRelated::class, 'parent_product_id');
    }

    public function skus()
    {
        return $this->hasMany(Sku::class);
    }

    public function galleries()
    {
        return $this->hasMany(ProductGallery::class);
    }

    public function category()
    {
        return $this->belongsTo(Category::class);
    }

    public function brand()
    {
        return $this->belongsTo(Brand::class);
    }
}
