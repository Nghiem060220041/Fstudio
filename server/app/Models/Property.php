<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Property extends Model
{
    use HasFactory;

    const TABLE = 'properties';
    protected $table = self::TABLE;
    protected $fillable = ['name', 'active'];
    public $timestamps = true;

    public function propertyOptions()
    {
        return $this->hasMany(PropertyOption::class);
    }
}
