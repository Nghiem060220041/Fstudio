<?php

namespace App\Http\Controllers\Admin;

use App\Exports\RevenuesExport;
use App\Http\Controllers\Controller;
use App\Http\Resources\Order\OrderCollection;
use App\Models\Customer;
use App\Models\Order;
use App\Models\Revenue;
use App\Services\Admin\Order\OrderService;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Maatwebsite\Excel\Facades\Excel;

class RevenueController extends Controller
{
    protected $orderService;

    public function __construct(
        OrderService $orderService
    ) {
        $this->middleware("permission:" . config('permissions')['super_admin'] . "|" . config('permissions')['develop'] . "", ['only' => ['index', 'show']]);

        $this->orderService = $orderService;
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
                'from'             => $request->from,
                'to'               => $request->to,
            ];

            $resultCollection = $this->orderService->indexRevenues($params);

            $result = OrderCollection::collection($resultCollection);

            return $result;
        } catch (\Throwable $e) {
            Log::info($e->getMessage());
        }
    }

    public function export(Request $request)
    {
        $params = [
            'keywords'         => $request->keywords,
            'page'             => $request->page,
            'per_page'         => $request->per_page,
            'order_by'         => $request->order_by,
            'sort_key'         => $request->sort_key,
            'status'           => $request->status,
            'payment_type'     => $request->payment_type,
            'from'             => $request->from,
            'to'               => $request->to,
        ];
        $orders = Order::with('childrenOrders', 'customer')
            ->whereNull('order_id')
            ->whereIn('status', [3, 4])
            ->orderBy($params['sort_key'] ?? 'id', $params['order_by'] ?? 'DESC');

        if (isset($params['from'], $params['to'])) {
            $from = Carbon::createFromFormat('D M d Y H:i:s e+', $params['from'])->startOfDay();
            $to = Carbon::createFromFormat('D M d Y H:i:s e+', $params['to'])->startOfDay();
            $orders = $orders->whereRaw("`created_at` BETWEEN '$from' AND '$to'");
        }

        if (isset($params['keywords'])) {
            $orders = $orders->leftJoin('customers', 'orders.customer_id', '=', 'customers.id')
                ->where('customers.phone', 'LIKE', '%' . $params['keywords'] . '%')
                ->orWhere('code', 'LIKE', '%' . $params['keywords'] . '%')
                ->orWhere('customers.name', 'LIKE', '%' . $params['keywords'] . '%')
                ->select('orders.*');
        }

        if (isset($params['payment_type'])) {
            $orders = $orders->where('payment_type', $params['payment_type']);
        }
        $response = Excel::download(new RevenuesExport($orders->get()), 'revenues.xlsx', \Maatwebsite\Excel\Excel::XLSX);
        ob_end_clean();

        return $response;
    }

    public function totalRevenue()
    {
        $currentMonth = date('m');
        $currentYear = date('Y');

        $previousMonth = date('m', strtotime('-1 month'));
        $previousYear = date('Y', strtotime('-1 month'));

        $currentMonthData = Order::whereMonth('created_at', $currentMonth)
            ->whereYear('created_at', $currentYear)
            ->whereNull('order_id')
            ->whereIn('status', [3, 4])
            ->where('status_payment', 1)
            ->sum('total');

        $previousMonthData = Order::whereMonth('created_at', $previousMonth)
            ->whereYear('created_at', $previousYear)
            ->whereNull('order_id')
            ->whereIn('status', [3, 4])
            ->where('status_payment', 1)
            ->sum('total');

        return response()->json([
            'statusCode' => 200,
            'dataCurrent' => $currentMonthData,
            'dataPrevious' => $previousMonthData,
        ], 200);
    }

    public function totalCustomer()
    {
        $currentMonth = date('m');
        $currentYear = date('Y');

        $previousMonth = date('m', strtotime('-1 month'));
        $previousYear = date('Y', strtotime('-1 month'));

        $currentMonthData = Customer::whereMonth('created_at', $currentMonth)
            ->whereYear('created_at', $currentYear)
            ->count('id');

        $previousMonthData = Customer::whereMonth('created_at', $previousMonth)
            ->whereYear('created_at', $previousYear)
            ->count('id');

        return response()->json([
            'statusCode' => 200,
            'dataCurrent' => $currentMonthData,
            'dataPrevious' => $previousMonthData,
        ], 200);
    }

    public function selectOrderByStatus()
    {
        $data = Order::select('status', DB::raw('COUNT(id) as totalOrder'))
            ->whereNull('order_id')
            ->groupBy('status')
            ->orderByDesc('totalOrder')
            ->get();
        $data = $data->map(function ($dt) {
            $dt->status = config("constant.status_order_common.$dt->status");
            return $dt;
        });

        return response()->json([
            'statusCode' => 200,
            'data' => $data,
        ], 200);
    }

    public function selectRevenuesByPaymentType()
    {
        $currentMonth = date('m');
        $currentYear = date('Y');

        $codData = array_fill(0, 12, 0);
        $vnpayData = array_fill(0, 12, 0);

        for ($i = 1; $i <= $currentMonth; $i++) {
            $revenueData = Order::select('payment_type', DB::raw('SUM(total) as totalPrice'))
                ->whereMonth('created_at', $i)
                ->whereYear('created_at', $currentYear)
                ->whereNull('order_id')
                ->whereIn('status', [3, 4])
                ->where('status_payment', 1)
                ->groupBy('payment_type')
                ->get();

            foreach ($revenueData as $payment) {
                $index = $i - 1;
                if ($payment->payment_type === '0') {
                    $codData[$index] = $payment->totalPrice;
                } elseif ($payment->payment_type === '1') {
                    $vnpayData[$index] = $payment->totalPrice;
                }
            }
        }

        $formatted = [
            [
                "label" => "COD",
                "data" => $codData,
            ],
            [
                "label" => "VNPAY",
                "data" => $vnpayData,
            ]
        ];

        return response()->json([
            'statusCode' => 200,
            'data' => $formatted,
        ], 200);
    }

    public function selectOrderRecent()
    {
        $data = Order::whereNull('order_id')
            ->with('customer')
            ->orderBy('id', 'desc')
            ->take(5)
            ->get();
        $data->map(function ($dt) {
            $dt->createdAt = date('d-m-Y H:i:s', strtotime($dt->created_at));
        });

        return response()->json([
            'statusCode' => 200,
            'data' => $data,
        ], 200);
    }

    public function totalProduct()
    {
        $currentMonth = date('m');
        $currentYear = date('Y');

        $previousMonth = date('m', strtotime('-1 month'));
        $previousYear = date('Y', strtotime('-1 month'));

        $currentMonthData = Customer::whereMonth('created_at', $currentMonth)
            ->whereYear('created_at', $currentYear)
            ->count('id');

        $previousMonthData = Customer::whereMonth('created_at', $previousMonth)
            ->whereYear('created_at', $previousYear)
            ->count('id');

        return response()->json([
            'statusCode' => 200,
            'dataCurrent' => $currentMonthData,
            'dataPrevious' => $previousMonthData,
        ], 200);
    }

    public function totalOrder()
    {
        $currentMonth = date('m');
        $currentYear = date('Y');

        $previousMonth = date('m', strtotime('-1 month'));
        $previousYear = date('Y', strtotime('-1 month'));

        $currentMonthData = Order::whereMonth('created_at', $currentMonth)
            ->whereYear('created_at', $currentYear)
            ->whereNull('order_id')
            ->whereIn('status', [3, 4])
            ->where('status_payment', 1)
            ->count('id');

        $previousMonthData = Order::whereMonth('created_at', $previousMonth)
            ->whereYear('created_at', $previousYear)
            ->whereNull('order_id')
            ->whereIn('status', [3, 4])
            ->where('status_payment', 1)
            ->count('id');

        return response()->json([
            'statusCode' => 200,
            'dataCurrent' => $currentMonthData,
            'dataPrevious' => $previousMonthData,
        ], 200);
    }

    public function totalRevenueMonth()
    {
        $currentMonth = date('m');
        $currentYear = date('Y');

        $totalRevenueByMonth = [];

        for ($i = 1; $i <= $currentMonth; $i++) {
            $totalRevenueByMonth[date("F", mktime(0, 0, 0, $i, 1, $currentYear))] = Order::whereMonth('created_at', $i)
                ->whereYear('created_at', $currentYear)
                ->whereNull('order_id')
                ->whereIn('status', [3, 4])
                ->where('status_payment', 1)
                ->sum('total');
        }
        $formated = [];
        foreach ($totalRevenueByMonth as $key => $data) {
            $formated[] = [
                "name"  => "T" . date("n", strtotime($key)),
                "Tổng tiền" => $data,
            ];
        }

        return response()->json([
            'statusCode' => 200,
            'data' => $formated,
        ], 200);
    }

    public function topSaleProductMonth()
    {
        $orders = Order::whereNotIn('status', [-1, 0])
            ->whereMonth('created_at', date('m'))
            ->whereYear('created_at', date('Y'))
            ->with(['childrenOrders' => function ($query) {
                $query->select('order_id', 'product_id', DB::raw('SUM(quantity) as totalQuantity'))
                    ->groupBy('order_id', 'product_id');
            }])
            ->get();

        $productQuantities = [];

        foreach ($orders as $order) {
            foreach ($order->childrenOrders as $childOrder) {
                $product_id = $childOrder->product_id;
                if (array_key_exists($product_id, $productQuantities)) {
                    $productQuantities[$product_id]['totalQuantity'] += $childOrder->totalQuantity;
                } else {
                    $productQuantities[$product_id] = [
                        'product' => $childOrder->product,
                        'totalQuantity' => (int)$childOrder->totalQuantity,
                    ];
                }
            }
        }

        $productQuantitiesCollection = collect($productQuantities);
        $topProducts = $productQuantitiesCollection->sortDesc()->take(5);

        return response()->json([
            'statusCode' => 200,
            'data' => $topProducts,
        ], 200);
    }
}
