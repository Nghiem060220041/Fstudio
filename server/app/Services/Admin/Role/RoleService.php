<?php

namespace App\Services\Admin\Role;

use App\Models\Role;
use App\Models\UserRole;
use App\Services\Admin\Permission\PermissionService;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Spatie\Permission\Models\Role as SpatieRole;
use Spatie\Permission\PermissionRegistrar;


class RoleService
{
    protected $role;
    protected $spatieRole;
    protected $permissionService;
    protected $userRole;

    public function __construct(
        Role $role,
        UserRole $userRole,
        SpatieRole $spatieRole,
        PermissionService $permissionService,
    ) {
        $this->role = $role;
        $this->userRole = $userRole;
        $this->spatieRole = $spatieRole;
        $this->permissionService = $permissionService;
    }

    public function index($params)
    {
        $roles = $this->role->whereNotIn('id', [1, 2])->orderBy($params['sort_key'] ?? 'id', $params['order_by'] ?? 'DESC');

        if (isset($params['keywords'])) {
            $roles = $roles->where('name', 'LIKE', '%' . $params['keywords'] . '%');
        }

        if (isset($params['per_page'])) {
            $roles = $roles
                ->paginate(
                    $params['per_page'],
                    ['*'],
                    'page',
                    $params['page'] ?? 1
                );
        } else {
            $roles = $roles->get();
        }

        $roles->map(function ($role) {
            $role->name        = limitTo($role->name, 10);
        });

        return $roles;
    }

    public function getRoles()
    {
        $roles = $this->role->whereNotIn('id', [1, 2])->get();

        return $roles;
    }

    public function show($id)
    {
        $role = $this->role->find($id);

        return $role;
    }

    public function getRole($id)
    {
        $role = $this->role->find($id);

        return $role;
    }

    public function store($data)
    {
        if (isset($data) && count($data) > 0) {
            DB::transaction(function () use ($data) {
                $role = $this->spatieRole
                    ->create(['name' => $data['name'], 'guard_name' => 'api']);
                if (isset($data['permissions'])) {
                    $role->syncPermissions($data['permissions']);
                }
                app()->make(PermissionRegistrar::class)->forgetCachedPermissions();
            });
        }
    }

    public function update($id, $data)
    {
        if (isset($id)) {
            $role = $this->getRole($id);
            if (isset($data['permissions'])) {
                $role->syncPermissions($data['permissions']);
            } else {
                $permission = $this->permissionService->getPermissions();
                $role->revokePermissionTo($permission);
            }
            Log::info($role);
            $role->update($data);
            app()->make(PermissionRegistrar::class)->forgetCachedPermissions();
        }
    }

    public function delete($id)
    {
        $role = $this->getRole($id);
        $model_roles = UserRole::where('role_id', $role->id)->get();
        foreach ($model_roles as $model_role) {
            UserRole::where('model_id', $model_role->model_id)->delete();
        }
        $role->delete();
        app()->make(PermissionRegistrar::class)->forgetCachedPermissions();
    }
}
