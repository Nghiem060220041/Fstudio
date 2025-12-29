<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class PropertyOptionSku extends Model
{
    use HasFactory;

    const TABLE = 'property_option_sku';
    protected $table = self::TABLE;
    protected $fillable = ['sku_id', 'property_option_id'];
    public $timestamps = false;
}
