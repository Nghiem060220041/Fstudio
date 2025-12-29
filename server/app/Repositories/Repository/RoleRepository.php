<?php

namespace App\Repositories\Repository;

use App\Models\Role;
use App\Models\UserRole;
use App\Repositories\BaseRepository;
use App\Repositories\Interface\PermissionRepositoryInterface;
use App\Repositories\Interface\RoleRepositoryInterface;
use Illuminate\Support\Facades\DB;
use Spatie\Permission\Models\Role as SpatieRole;
use Spatie\Permission\PermissionRegistrar;

class RoleRepository extends BaseRepository implements RoleRepositoryInterface
{
    protected $role;
    protected $spatieRole;
    protected $permissionRepository;
    protected $userRole;

    public function __construct(
        Role $role,
        UserRole $userRole,
        SpatieRole $spatieRole,
        PermissionRepositoryInterface $permissionRepository,
    ) {
        $this->role                 = $role;
        $this->userRole             = $userRole;
        $this->spatieRole           = $spatieRole;
        $this->permissionRepository = $permissionRepository;
    }

    public function show()
    {
        $role = $this->role->find(auth()->id());

        return $role;
    }

    public function getRole($id)
    {
        $role = $this->role->find($id);

        return $role;
    }

    public function getRoles()
    {
        $roles = $this->role->all();

        return $roles;
    }

    public function getRoleFilters($data)
    {
        $roles = $this->role
                ->whereNotIn('id', [config('constant')['super_admin_id'], config('constant')['develop_id']])
                ->when(isset($data['name']), function ($query) use ($data) {
                    return $query->where('name', 'LIKE', '%' . $data['name'] . '%');
                })
                ->orderBy('id', 'desc')
                ->filter($data);

        return $roles->get();
    }

    public function updateRole($data, $id)
    {
        if (isset($id)) {
            $role = $this->getRole($id);
            if (isset($data['permissions'])) {
                $role->syncPermissions($data['permissions']);
            } else {
                $permission = $this->permissionRepository->getPermissions();
                $role->revokePermissionTo($permission);
            }
            $role->update($data);
            app()->make(PermissionRegistrar::class)->forgetCachedPermissions();
        }
    }

    public function deleteRole($id)
    {
        $role = $this->getRole($id);
        $model_roles = UserRole::where('role_id', $role->id)->get();
        foreach ($model_roles as $model_role) {
            UserRole::where('model_id', $model_role->model_id)->delete();
        }
        $role->delete();
        app()->make(PermissionRegistrar::class)->forgetCachedPermissions();
    }

    public function createRole($data)
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
}
