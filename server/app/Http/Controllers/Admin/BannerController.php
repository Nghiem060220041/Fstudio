<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Resources\Banner\BannerCollection;
use App\Services\Admin\Banner\BannerService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Str;

class BannerController extends Controller
{
    protected $bannerService;

    public function __construct(
        BannerService $bannerService
    ) {
        $this->middleware("permission:" . config('permissions')['banners']['banner.list'] .   "|" . config('permissions')['super_admin'] . "|" . config('permissions')['develop'] . "", ['only' => ['index', 'show']]);
        $this->middleware("permission:" . config('permissions')['banners']['banner.create'] . "|" . config('permissions')['super_admin'] . "|" . config('permissions')['develop'] . "", ['only' => ['store']]);
        $this->middleware("permission:" . config('permissions')['banners']['banner.edit'] .   "|" . config('permissions')['super_admin'] . "|" . config('permissions')['develop'] . "", ['only' => ['update', 'active']]);
        $this->middleware("permission:" . config('permissions')['banners']['banner.delete'] . "|" . config('permissions')['super_admin'] . "|" . config('permissions')['develop'] . "", ['only' => ['destroy']]);

        $this->bannerService = $bannerService;
    }

    public function getAllFront(Request $request)
    {
        try {
            $result = $this->bannerService->getBanners();

            return response()->json([
                'data' => $result
            ]);
        } catch (\Throwable $th) {
            Log::info($th->getMessage());
        }
    }

    public function index(Request $request)
    {
        try {
            $params = [
                'keywords' => $request->keywords,
                'page'     => $request->page,
                'per_page' => $request->per_page,
                'order_by' => $request->order_by,
                'sort_key' => $request->sort_key,
                'active'   => $request->active,
            ];

            $resultCollection = $this->bannerService->index($params);

            $result = BannerCollection::collection($resultCollection);

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
            $this->bannerService->store($data);

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
        $banner           = $this->bannerService->getBannerById($id);
        $banner['active'] = $banner['active'] === 1 ? true : false;

        return response()->json([
            'data'        => $banner,
        ]);
    }

    public function update(Request $request, $id)
    {
        try {
            $data = $request->all();
            $data['active'] = $data['active'] == true ? 1 : 0;
            $this->bannerService->update($id, $data);

            return response()->json([
                'result'        => 0,
                'message'       => "Cập nhật thành công!",
            ], 200);
        } catch (\Throwable $th) {
            Log::info($th->getMessage());
        }
    }

    public function active(Request $request, $id)
    {
        try {
            $data = $request->all();
            $data['active'] = $data['active'] == true ? 1 : 0;
            $this->bannerService->active($id, $data);

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
                $this->bannerService->delete($id);
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
