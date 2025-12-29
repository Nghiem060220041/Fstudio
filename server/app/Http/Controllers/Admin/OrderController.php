<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Resources\Order\OrderCollection;
use App\Services\Admin\Order\OrderService;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Str;

class OrderController extends Controller
{
    protected $orderService;

    public function __construct(
        OrderService $orderService
    ) {
        $this->middleware("permission:" . config('permissions')['orders']['order.list'] .   "|" . config('permissions')['super_admin'] . "|" . config('permissions')['develop'] . "", ['only' => ['index', 'show']]);
        $this->middleware("permission:" . config('permissions')['orders']['order.edit'] .   "|" . config('permissions')['super_admin'] . "|" . config('permissions')['develop'] . "", ['only' => ['update', 'active']]);

        $this->orderService = $orderService;
    }

    public function checkCoupon($customer, $coupon)
    {
        try {
            $result = $this->orderService->checkCoupon($customer, $coupon);

            return $result;
        } catch (\Throwable $th) {
            Log::info($th->getMessage());
        }
    }

    public function getAllFront(Request $request)
    {
        try {
            $result = $this->orderService->getOrders();

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
                'keywords'         => $request->keywords,
                'page'             => $request->page,
                'per_page'         => $request->per_page,
                'order_by'         => $request->order_by,
                'sort_key'         => $request->sort_key,
                'status'           => $request->status,
                'payment_type'     => $request->payment_type,
                'status_payment'   => $request->status_payment,
            ];

            $resultCollection = $this->orderService->index($params);

            $result = OrderCollection::collection($resultCollection);

            return $result;
        } catch (\Throwable $e) {
            Log::info($e->getMessage());
        }
    }

    public function index2(Request $request, $customerId)
    {
        try {
            $params = [
                'keywords'         => $request->keywords,
                'page'             => $request->page,
                'per_page'         => $request->per_page,
                'order_by'         => $request->order_by,
                'sort_key'         => $request->sort_key,
                'status'           => $request->status,
                'payment_type'     => $request->payment_type,
                'status_payment'   => $request->status_payment,
            ];

            $resultCollection = $this->orderService->index2($params, $customerId);

            $result = OrderCollection::collection($resultCollection);

            return $result;
        } catch (\Throwable $e) {
            Log::info($e->getMessage());
        }
    }

    public function store(Request $request)
    {
        try {
            $data = $request->all();
            $data = $this->orderService->store($data);

            return $data;
        } catch (\Throwable $th) {
            Log::info($th->getMessage());
        }
    }

    public function vnpay2(Request $request, $code)
    {
        try {
            $data = $request->all();
            $data = $this->orderService->vnpay2($code);

            return $data;
        } catch (\Throwable $th) {
            Log::info($th->getMessage());
        }
    }

    public function vnpayIpn(Request $request)
    {
        try {
            $data = $request->all();
            $data = $this->orderService->vnpayIpn($request->all());

            return $data;
        } catch (\Throwable $th) {
            Log::info($th->getMessage());
        }
    }

    public function cancelled(Request $request, $code)
    {
        try {
            $data = $request->all();
            $data = $this->orderService->cancelled($code);

            return $data;
        } catch (\Throwable $th) {
            Log::info($th->getMessage());
        }
    }

    public function show($id)
    {
        $order           = $this->orderService->getOrderById($id);

        return response()->json([
            'data'        => $order,
        ]);
    }

    public function searchOrder($code)
    {
        $order           = $this->orderService->getOrderByCode($code);
        if (!$order) {
            return response()->json([
                'statusCode'     => 400,
                'message'        => "Không tìm thấy đơn đặt hàng này.",
            ], 400);
        }

        return response()->json([
            'data'        => $order,
            'message'     => "Tìm thấy đơn hàng yêu cầu."
        ], 200);
    }

    public function update(Request $request, $id)
    {
        try {
            $data = $request->all();
            $this->orderService->update($id, $data);

            return response()->json([
                'result'        => 0,
                'message'       => "Cập nhật thành công!",
            ], 200);
        } catch (\Throwable $th) {
            Log::info($th->getMessage());
        }
    }

    public function payment(Request $request, $code)
    {
        try {
            $data = $request->all();
            $data['status_payment'] = config('constant.status_payment.paid');
            $data['payment_at']     = Carbon::now()->toDateTimeString();
            $this->orderService->payment($code, $data);

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
