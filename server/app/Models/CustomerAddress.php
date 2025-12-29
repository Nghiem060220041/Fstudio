<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class CustomerAddress extends Model
{
    use HasFactory;

    const TABLE = 'customer_addresss';
    protected $table = self::TABLE;
    protected $fillable = [
        'customer_id',
        'province_id',
        'district_id',
        'ward_id',
        'address',
        'is_default'
    ];
    public $timestamps = false;
}
