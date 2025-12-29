<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\Role\CreateRequest;
use App\Http\Resources\Role\RoleCollection;
use App\Services\Admin\Permission\PermissionService;
use App\Services\Admin\Role\RoleService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

class RoleController extends Controller
{
    protected $roleService;
    protected $permissionService;

    public function __construct(
        RoleService $roleService,
        PermissionService $permissionService,
    ) {
        $this->middleware("permission:" . config('permissions')['roles']['role.list'] .   "|" . config('permissions')['super_admin'] . "|" . config('permissions')['develop'] . "", ['only' => ['index', 'show']]);
        $this->middleware("permission:" . config('permissions')['roles']['role.create'] . "|" . config('permissions')['super_admin'] . "|" . config('permissions')['develop'] . "", ['only' => ['store']]);
        $this->middleware("permission:" . config('permissions')['roles']['role.edit'] .   "|" . config('permissions')['super_admin'] . "|" . config('permissions')['develop'] . "", ['only' => ['update', 'active']]);
        $this->middleware("permission:" . config('permissions')['roles']['role.delete'] . "|" . config('permissions')['super_admin'] . "|" . config('permissions')['develop'] . "", ['only' => ['destroy']]);

        $this->roleService       = $roleService;
        $this->permissionService = $permissionService;
    }

    public function index(Request $request)
    {
        try {
            $params = [
                'keywords' => $request->keywords,
                'page' => $request->page,
                'per_page' => $request->per_page,
                'order_by' => $request->order_by,
                'sort_key' => $request->sort_key,
            ];

            $resultCollection = $this->roleService->index($params);

            $result = RoleCollection::collection($resultCollection);

            return $result;
        } catch (\Throwable $e) {
            Log::info($e->getMessage());
        }
    }

    public function store(CreateRequest $request)
    {
        try {
            $data = $request->all();
            DB::transaction(function () use ($data) {
                $this->roleService->store($data);
            });

            return response()->json([
                'result'  => 0,
                'message' => "Tạo mới thành công!",
            ], 200);
        } catch (\Exception $e) {
            Log::info($e->getMessage());
            return $this->errorBack('Đã xảy ra lỗi');
        }
    }

    public function show(Request $request, $id)
    {
        $role        = $this->roleService->show($id);
        $roleKeys    = config('constant.roles');
        $permission  = $role->permissions->pluck('id')->toArray();
        $permissions = $this->permissionService->getPermissions()->groupBy('module_name');

        return response()->json([
            'role'        => $role,
            'permission'  => $permission,
            'roleKey'     => $roleKeys,
            'permissions' => $permissions,
        ]);
    }

    public function update(Request $request, $id)
    {
        try {
            $data = $request->all();
            DB::transaction(function () use ($data, $id) {
                $this->roleService->update($id, $data);
            });

            return response()->json([
                'result'  => 0,
                'message' => "Cập nhật thành công!",
            ], 200);
        } catch (\Exception $e) {
            Log::info($e->getMessage());
            return $this->errorBack('Đã xảy ra lỗi');
        }
    }

    public function destroy($id)
    {
        try {
            DB::transaction(function () use ($id) {
                $this->roleService->delete($id);
            });

            return response()->json([
                'result'  => 0,
                'message' => "Xoá thành công!",
            ], 200);
        } catch (\Exception $e) {
            Log::info($e->getMessage());
            return $this->errorBack('Đã xảy ra lỗi');
        }
    }
}
