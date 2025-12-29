<?php

namespace App\Services\Admin\Permission;

use App\Models\Permission;

class PermissionService
{
    protected $permission;

    public function __construct(
        Permission $permission
    ) {
        $this->permission = $permission;
    }

    public function getPermissions()
    {
        $permissions = $this->permission->get();
        foreach ($permissions as $key => $permission) {
            if ($permission->name == 'super_admin' || $permission->name =='develop' ) {
                unset($permissions[$key]);
            }
        }

        return $permissions;
    }
}
