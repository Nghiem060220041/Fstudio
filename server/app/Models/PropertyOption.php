<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class PropertyOption extends Model
{
    use HasFactory;

    const TABLE = 'property_options';
    protected $table = self::TABLE;
    protected $fillable = ['name', 'property_id', 'active'];
    public $timestamps = true;

    public function property()
    {
        return $this->belongsTo(Property::class);
    }
}
