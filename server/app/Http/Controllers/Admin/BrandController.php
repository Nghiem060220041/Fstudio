<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\Brand\CreateRequest;
use App\Http\Requests\Admin\Brand\UpdateRequest;
use App\Http\Resources\Brand\BrandCollection;
use App\Services\Admin\Brand\BrandService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Str;

class BrandController extends Controller
{
    protected $brandService;

    public function __construct(
        BrandService $brandService
    ) {
        $this->middleware("permission:" . config('permissions')['brands']['brand.list'] .   "|" . config('permissions')['super_admin'] . "|" . config('permissions')['develop'] . "", ['only' => ['index', 'show']]);
        $this->middleware("permission:" . config('permissions')['brands']['brand.create'] . "|" . config('permissions')['super_admin'] . "|" . config('permissions')['develop'] . "", ['only' => ['store']]);
        $this->middleware("permission:" . config('permissions')['brands']['brand.edit'] .   "|" . config('permissions')['super_admin'] . "|" . config('permissions')['develop'] . "", ['only' => ['update']]);
        $this->middleware("permission:" . config('permissions')['brands']['brand.delete'] . "|" . config('permissions')['super_admin'] . "|" . config('permissions')['develop'] . "", ['only' => ['destroy']]);

        $this->brandService = $brandService;
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

            $resultCollection = $this->brandService->index($params);

            $result = BrandCollection::collection($resultCollection);

            return $result;
        } catch (\Throwable $e) {
            Log::info($e->getMessage());
        }
    }

    public function store(CreateRequest $request)
    {
        try {
            $data = $request->all();
            $data['slug']   = Str::slug($data['name'], '-');
            $this->brandService->store($data);
            
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
        $brand           = $this->brandService->getBrandById($id);

        return response()->json([
            'data'        => $brand,
        ]);
    }

    public function update(UpdateRequest $request, $id)
    {
        try {
            $data = $request->all();
            $data['slug']   = Str::slug($data['name'], '-');
            $this->brandService->update($id, $data);
            
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
                $this->brandService->delete($id);
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
