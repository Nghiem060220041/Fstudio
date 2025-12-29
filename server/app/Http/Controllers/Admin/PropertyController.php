<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Resources\Property\PropertyCollection;
use App\Models\Product;
use App\Services\Admin\Property\PropertyService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Str;

class PropertyController extends Controller
{
    protected $propertyService;

    public function __construct(
        PropertyService $propertyService,
    ) {
        $this->middleware("permission:" . config('permissions')['products']['product.list'] .   "|" . config('permissions')['super_admin'] . "|" . config('permissions')['develop'] . "", ['only' => ['index', 'show']]);
        $this->middleware("permission:" . config('permissions')['products']['product.create'] . "|" . config('permissions')['super_admin'] . "|" . config('permissions')['develop'] . "", ['only' => ['store']]);
        $this->middleware("permission:" . config('permissions')['products']['product.edit'] .   "|" . config('permissions')['super_admin'] . "|" . config('permissions')['develop'] . "", ['only' => ['update', 'active']]);
        $this->middleware("permission:" . config('permissions')['products']['product.delete'] . "|" . config('permissions')['super_admin'] . "|" . config('permissions')['develop'] . "", ['only' => ['destroy']]);

        $this->propertyService   = $propertyService;
    }

    public function index(Request $request)
    {
        try {
            $params = [
                'keywords'       => $request->keywords,
                'page'           => $request->page,
                'per_page'       => $request->per_page,
                'order_by'       => $request->order_by,
                'sort_key'       => $request->sort_key,
                'active'         => $request->active,
            ];

            $resultCollection = $this->propertyService->index($params);

            $result = PropertyCollection::collection($resultCollection);

            return $result;
        } catch (\Throwable $e) {
            Log::info($e->getMessage());
        }
    }

    public function store(Request $request)
    {
        try {
            $data = $request->all();
            $data['active'] = $data['active'] == true ? 1 : 0;
            $this->propertyService->store($data);
            
            return response()->json([
                'result'        => 0,
                'message'       => "Tạo mới thành công!",
            ], 200);
        } catch (\Throwable $th) {
            Log::info($th->getMessage());
        }
    }

    public function show($id)
    {
        $product                 = $this->propertyService->getPropertyById($id);
        $product['active']       = $product['active'] === 1 ? true : false;

        return response()->json([
            'data'        => $product,
        ]);
    }

    public function update(Request $request, $id)
    {
        try {
            $data = $request->all();
            $data['active'] = $data['active'] == true ? 1 : 0;
            $this->propertyService->update($id, $data);
            
            return response()->json([
                'result'        => 0,
                'message'       => "Cập nhật thành công!",
            ], 200);
        } catch (\Throwable $th) {
            Log::info($th->getMessage());
        }
    }

    public function destroy($id)
    {
        
        try {
            DB::transaction(function () use ($id) {
                $this->propertyService->delete($id);
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

    public function active(Request $request, $id)
    {
        try {
            $data = $request->all();
            $data['active'] = $data['active'] == true ? 1 : 0;
            $this->propertyService->active($id, $data);

            return response()->json([
                'result'  => 0,
                'message' => "Cập nhật thành công!",
            ], 200);
        } catch (\Exception $e) {
            Log::info($e->getMessage());
            return $this->errorBack('Đã xảy ra lỗi');
        }
    }
}
