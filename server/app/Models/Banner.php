<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Banner extends Model
{
    use HasFactory;

    const TABLE = 'banners';
    protected $table = self::TABLE;
    protected $fillable = ['name', 'url', 'position', 'description', 'active'];
    public $timestamps = true;

    public function image()
    {
        return $this->morphOne(Image::class, 'imageable');
    }
}
