<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Services\Admin\Role\RoleService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Kjmtrue\VietnamZone\Models\District;
use Kjmtrue\VietnamZone\Models\Province;
use Kjmtrue\VietnamZone\Models\Ward;

class HomeController extends Controller
{
    protected $provinces;
    protected $districts;
    protected $wards;
    protected $roleService;

    public function __construct(
        Province $provinces,
        District $districts,
        Ward $wards,
        RoleService $roleService
    ) {
        $this->provinces       = $provinces;
        $this->districts       = $districts;
        $this->wards           = $wards;
        $this->roleService     = $roleService;
    }

    public function getProvinces(Request $request)
    {
        try {
            $provinces = Province::orderBy('name', 'asc')->get();
            return response()->json([
                'statusCode' => 200,
                'data'       => $provinces,
            ], 200);
        } catch (\Throwable $e) {
            Log::info($e->getMessage());
        }
    }

    public function getRoles(Request $request)
    {
        try {
            $roles = $this->roleService->getRoles();
            return response()->json([
                'statusCode' => 200,
                'data'       => $roles,
            ], 200);
        } catch (\Throwable $e) {
            Log::info($e->getMessage());
        }
    }

    public function getDistricts(Request $request, $provinceId)
    {
        try {
            $districts = District::where('province_id', $provinceId)->orderBy('name', 'asc')->get();
            return response()->json([
                'statusCode' => 200,
                'data'       => $districts,
            ], 200);
        } catch (\Throwable $e) {
            Log::info($e->getMessage());
        }
    }

    public function getWards(Request $request, $districtId)
    {
        try {
            $wards = Ward::where('district_id', $districtId)->orderBy('name', 'asc')->get();
            return response()->json([
                'statusCode' => 200,
                'data'       => $wards,
            ], 200);
        } catch (\Throwable $e) {
            Log::info($e->getMessage());
        }
    }
}
