<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class UserRole extends Model
{
    use HasFactory;

    const TABLE = 'model_has_roles';
    protected $table = self::TABLE;
    protected $guarded = [];
    public $timestamps = false;
}
