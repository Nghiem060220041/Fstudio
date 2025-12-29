<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Image extends Model
{
    use HasFactory;

    const TABLE = 'images';
    protected $table = self::TABLE;
    protected $fillable = ['path'];
    public $timestamps = true;

    public function imageable()
    {
        return $this->morphTo();
    }
}
