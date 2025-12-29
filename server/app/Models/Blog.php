<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Blog extends Model
{
    use HasFactory;

    const TABLE = 'blogs';
    protected $table = self::TABLE;
    protected $fillable = ['name', 'description', 'slug', 'active'];
    public $timestamps = true;
    
    public function image()
    {
        return $this->morphOne(Image::class, 'imageable');
    }
}
