<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Support\Facades\Auth;

class CheckPermission
{
    public function handle($request, Closure $next, $permissions)
    {
        if (!auth()->check()) {
            return response()->json(['message' => 'Unauthorized'], 401);
        }

        $permissions = explode('|', $permissions);

        // Kiểm tra quyền truy cập
        foreach ($permissions as $permission) {
            if (auth()->user()->hasPermissionTo($permission)) {
                return $next($request);
            }
        }

        return response()->json(['message' => 'Permission denied'], 403);
    }
}
