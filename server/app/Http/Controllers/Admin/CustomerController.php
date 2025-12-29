<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\Customer\UpdateRequest;
use App\Http\Requests\Admin\Customer\UpdateRequestPassword;
use App\Http\Resources\Customer\CustomerCollection;
use App\Services\Admin\Customer\CustomerService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

class CustomerController extends Controller
{
    protected $customerService;

    public function __construct(
        CustomerService $customerService
    ) {
        $this->middleware("permission:" . config('permissions')['orders']['order.list'] .   "|" . config('permissions')['super_admin'] . "|" . config('permissions')['develop'] . "", ['only' => ['index', 'show']]);
        $this->middleware("permission:" . config('permissions')['orders']['order.create'] . "|" . config('permissions')['super_admin'] . "|" . config('permissions')['develop'] . "", ['only' => ['store']]);
        $this->middleware("permission:" . config('permissions')['orders']['order.edit'] .   "|" . config('permissions')['super_admin'] . "|" . config('permissions')['develop'] . "", ['only' => ['update', 'active']]);
        $this->middleware("permission:" . config('permissions')['orders']['order.delete'] . "|" . config('permissions')['super_admin'] . "|" . config('permissions')['develop'] . "", ['only' => ['destroy']]);

        $this->customerService = $customerService;
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

            $resultCollection = $this->customerService->index($params);

            $result = CustomerCollection::collection($resultCollection);

            return $result;
        } catch (\Throwable $e) {
            Log::info($e->getMessage());
        }
    }

    public function active(Request $request, $id)
    {
        try {
            $data = $request->all();
            $data['active'] = $data['active'] == true ? 1 : 0;
            $this->customerService->active($id, $data);

            return response()->json([
                'result'  => 0,
                'message' => "Cập nhật thành công!",
            ], 200);
        } catch (\Exception $e) {
            Log::info($e->getMessage());
            return $this->errorBack('Đã xảy ra lỗi');
        }
    }

    // public function store(CreateRequest $request)
    // {
    //     try {
    //         $data = $request->all();
    //         $data['slug']   = Str::slug($data['name'], '-');
    //         $this->brandService->store($data);

    //         return response()->json([
    //             'result'        => 0,
    //             'message'       => "Tạo mới thành công!",
    //         ], 200);
    //     } catch (\Throwable $th) {
    //         Log::info($th->getMessage());
    //     }
    // }

    // public function show($id)
    // {
    //     $brand           = $this->brandService->getBrandById($id);

    //     return response()->json([
    //         'data'        => $brand,
    //     ]);
    // }

    public function update(UpdateRequest $request, $id)
    {
        try {
            $data = $request->all();
            $this->customerService->update($id, $data);

            return response()->json([
                'result'        => 0,
                'message'       => "Cập nhật thành công!",
            ], 200);
        } catch (\Throwable $th) {
            Log::info($th->getMessage());
        }
    }

    public function updateFE(UpdateRequest $request, $id)
    {
        try {
            $data = $request->all();
            $this->customerService->update($id, $data);

            return response()->json([
                'result'        => 0,
                'message'       => "Cập nhật thành công!",
            ], 200);
        } catch (\Throwable $th) {
            Log::info($th->getMessage());
        }
    }

    public function updatePassword(UpdateRequestPassword $request, $id)
    {
        try {
            $data = $request->all();
            $this->customerService->update($id, $data);

            return response()->json([
                'result'        => 0,
                'message'       => "Cập nhật thành công!",
            ], 200);
        } catch (\Throwable $th) {
            Log::info($th->getMessage());
        }
    }

    public function deleteFE($id)
    {
        try {
            DB::transaction(function () use ($id) {
                $this->customerService->delete($id);
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
