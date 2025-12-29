<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Spatie\Permission\Traits\HasPermissions;

class Permission extends Model
{
    use HasFactory, HasPermissions;

    const TABLE = 'permissions';
    protected $table = self::TABLE;
    protected $guarded = [];
    public $timestamps = true;

    const PERMISSION_TYPES = ['readonly', 'readwrite'];
}
