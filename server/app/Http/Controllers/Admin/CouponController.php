<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\Coupon\CreateRequest;
use App\Http\Requests\Admin\Coupon\UpdateRequest;
use App\Http\Resources\Coupon\CouponCollection;
use App\Services\Admin\Coupon\CouponService;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Str;

class CouponController extends Controller
{
    protected $couponService;

    public function __construct(
        CouponService $couponService
    ) {
        $this->middleware("permission:" . config('permissions')['products']['product.list'] .   "|" . config('permissions')['super_admin'] . "|" . config('permissions')['develop'] . "", ['only' => ['index', 'show']]);
        $this->middleware("permission:" . config('permissions')['products']['product.create'] . "|" . config('permissions')['super_admin'] . "|" . config('permissions')['develop'] . "", ['only' => ['store']]);
        $this->middleware("permission:" . config('permissions')['products']['product.edit'] .   "|" . config('permissions')['super_admin'] . "|" . config('permissions')['develop'] . "", ['only' => ['update']]);
        $this->middleware("permission:" . config('permissions')['products']['product.delete'] . "|" . config('permissions')['super_admin'] . "|" . config('permissions')['develop'] . "", ['only' => ['destroy']]);

        $this->couponService = $couponService;
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

            $resultCollection = $this->couponService->index($params);

            $result = CouponCollection::collection($resultCollection);

            return $result;
        } catch (\Throwable $e) {
            Log::info($e->getMessage());
        }
    }

    public function getAllCoupons()
    {
        try {
            $result = $this->couponService->getCoupons();

            return response()->json([
                'data' => $result,
            ]);
        } catch (\Throwable $e) {
            Log::info($e->getMessage());
        }
    }

    public function store(CreateRequest $request)
    {
        try {
            $data = $request->all();
            $data['active']         = $data['active'] == true ? 1 : 0;
            $data['new_customer']   = $data['new_customer'] == true ? 1 : 0;
            $data['has_expired']    = $data['has_expired'] == true ? 1 : 0;
            $data['code']           = strtoupper($data['code']);
            $data['expired_at']     = Carbon::parse($data['expiredDate'])->format('Y-m-d H:i:s');
            $this->couponService->store($data);

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
        $coupon                 = $this->couponService->getCouponById($id);
        $coupon['active']       = $coupon['active'] === 1 ? true : false;
        $coupon['has_expired']  = $coupon['has_expired'] === 1 ? true : false;
        $coupon['new_customer'] = $coupon['new_customer'] === 1 ? true : false;
        $coupon['expiredDate']  = $coupon['expired_at'];

        return response()->json([
            'data'        => $coupon,
        ]);
    }

    public function update(UpdateRequest $request, $id)
    {
        try {
            $data                   = $request->all();
            $data['active']         = $data['active'] == true ? 1 : 0;
            $data['new_customer']   = $data['new_customer'] == true ? 1 : 0;
            $data['has_expired']    = $data['has_expired'] == true ? 1 : 0;
            $data['code']           = strtoupper($data['code']);
            $data['expired_at']     = Carbon::parse($data['expiredDate'])->format('Y-m-d H:i:s');
            $this->couponService->update($id, $data);

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
                $this->couponService->delete($id);
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
            $this->couponService->active($id, $data);

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
