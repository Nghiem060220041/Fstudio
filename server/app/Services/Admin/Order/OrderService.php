<?php

namespace App\Services\Admin\Order;

use App\Models\Order;
use Kjmtrue\VietnamZone\Models\District;
use Kjmtrue\VietnamZone\Models\Ward;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\Mail;
use LaravelDaily\Invoices\Invoice;
use LaravelDaily\Invoices\Classes\InvoiceItem;
use LaravelDaily\Invoices\Classes\Party;
use App\Mail\Invoice as MailInvoice;
use App\Models\Coupon;
use App\Models\Customer;
use App\Models\CustomerCoupon;
use App\Models\PropertyOption;
use App\Models\Sku;
use App\Services\Admin\Coupon\CouponService;
use App\Services\Admin\Customer\CustomerService as CustomerCustomerService;
use App\Services\Admin\Product\ProductService;
use App\Services\Admin\Property\PropertyService;
use Carbon\Carbon;
use Exception;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use PHPUnit\Framework\Constraint\Count;

class OrderService
{
    protected $order;
    protected $customerService;
    protected $productService;
    protected $propertyService;
    protected $couponService;
    protected $customerCoupon;
    protected $sku;

    public function __construct(
        Order $order,
        CustomerCustomerService $customerService,
        ProductService $productService,
        PropertyService $propertyService,
        CouponService $couponService,
        CustomerCoupon $customerCoupon,
        Sku $sku,
    ) {
        $this->order            = $order;
        $this->customerService  = $customerService;
        $this->productService   = $productService;
        $this->sku              = $sku;
        $this->propertyService  = $propertyService;
        $this->couponService    = $couponService;
        $this->customerCoupon   = $customerCoupon;
    }

    public function index($params)
    {
        $orders = $this->order->with('childrenOrders', 'customer')->whereNull('order_id')->orderBy($params['sort_key'] ?? 'id', $params['order_by'] ?? 'DESC');

        if (isset($params['keywords'])) {
            $orders = $orders->leftJoin('customers', 'orders.customer_id', '=', 'customers.id')
                ->where('customers.phone', 'LIKE', '%' . $params['keywords'] . '%')
                ->orWhere('code', 'LIKE', '%' . $params['keywords'] . '%')
                ->orWhere('customers.name', 'LIKE', '%' . $params['keywords'] . '%')
                ->select('orders.*');
        }

        if (isset($params['status'])) {
            $orders = $orders->where('status', $params['status']);
        }

        if (isset($params['payment_type'])) {
            $orders = $orders->where('payment_type', $params['payment_type']);
        }

        if (isset($params['per_page'])) {
            $orders = $orders
                ->paginate(
                    $params['per_page'],
                    ['*'],
                    'page',
                    $params['page'] ?? 1
                );
        } else {
            $orders = $orders->get();
        }


        $orders->map(function ($order) {
            $date                     = date('d-m-Y H:i:s', strtotime($order->created_at));
            $order->createdAt         = $date;
            $order->filename          = $order->code . '_' . Str::slug($order->customer->name) . '.pdf';
            $order->class             = config("constant.className.$order->status");
            $order->class_status      = config("constant.classNameStatusPayment.$order->status_payment");
            $order->class_type        = config("constant.classNameTypePayment.$order->payment_type");
            $order->status_code       = $order->status;
            $order->status            = config("constant.status_order_common.$order->status");
            $order->status_payment    = config("constant.status_payment_common.$order->status_payment");
            $order->payment_type      = config("constant.payment_type_common.$order->payment_type");
        });

        return $orders;
    }

    public function index2($params, $customerId)
    {
        $orders = $this->order
            ->with('childrenOrders', 'customer')
            ->whereNull('order_id')
            ->where('customer_id', $customerId)
            ->orderBy($params['sort_key'] ?? 'id', $params['order_by'] ?? 'DESC');

        if (isset($params['keywords'])) {
            $orders = $orders->leftJoin('customers', 'orders.customer_id', '=', 'customers.id')
                ->where('customers.phone', 'LIKE', '%' . $params['keywords'] . '%')
                ->orWhere('code', 'LIKE', '%' . $params['keywords'] . '%')
                ->orWhere('customers.name', 'LIKE', '%' . $params['keywords'] . '%')
                ->select('orders.*');
        }

        if (isset($params['status'])) {
            $orders = $orders->where('status', $params['status']);
        }

        if (isset($params['payment_type'])) {
            $orders = $orders->where('payment_type', $params['payment_type']);
        }

        if (isset($params['per_page'])) {
            $orders = $orders
                ->paginate(
                    $params['per_page'],
                    ['*'],
                    'page',
                    $params['page'] ?? 1
                );
        } else {
            $orders = $orders->get();
        }


        $orders->map(function ($order) {
            $date                     = date('d-m-Y H:i:s', strtotime($order->created_at));
            $order->createdAt         = $date;
            $order->filename          = $order->code . '_' . Str::slug($order->customer->name) . '.pdf';
            $order->class             = config("constant.className.$order->status");
            $order->class_status      = config("constant.classNameStatusPayment.$order->status_payment");
            $order->class_type        = config("constant.classNameTypePayment.$order->payment_type");
            $order->status_code       = $order->status;
            $order->status            = config("constant.status_order_common.$order->status");
            $order->status_payment    = config("constant.status_payment_common.$order->status_payment");
            $order->payment_type      = config("constant.payment_type_common.$order->payment_type");
        });

        return $orders;
    }

    public function indexRevenues($params)
    {
        $orders = $this->order
            ->with('childrenOrders', 'customer')
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

        if (isset($params['per_page'])) {
            $orders = $orders
                ->paginate(
                    $params['per_page'],
                    ['*'],
                    'page',
                    $params['page'] ?? 1
                );
        } else {
            $orders = $orders->get();
        }


        $orders->map(function ($order) {
            $date                     = date('d-m-Y H:i:s', strtotime($order->created_at));
            $order->createdAt         = $date;
            $order->filename          = $order->code . '_' . Str::slug($order->customer->name) . '.pdf';
            $order->class             = config("constant.className.$order->status");
            $order->class_status      = config("constant.classNameStatusPayment.$order->status_payment");
            $order->class_type        = config("constant.classNameTypePayment.$order->payment_type");
            $order->status_code       = $order->status;
            $order->status            = config("constant.status_order_common.$order->status");
            $order->status_payment    = config("constant.status_payment_common.$order->status_payment");
            $order->payment_type      = config("constant.payment_type_common.$order->payment_type");
        });

        return $orders;
    }

    public function checkCoupon($customerId, $code)
    {
        $customer = $this->customerService->getCustomerById($customerId);
        $cus      = Customer::where('phone', $customer->phone)->withTrashed()->first();
        $od       = Order::where('customer_id', $cus->id)->first();
        $coupon = $this->couponService->getCouponByCode($code);
        $check = $this->customerCoupon->where('customer_id', $customerId)->where('coupon_id', $coupon->id)->first();
        $check2 = $this->customerCoupon->where('customer_id', $cus->id)->where('coupon_id', $coupon->id)->first();

        if ($od && $check2) {
            return response()->json([
                "message" => "Phát hiện hành vi gian lận, không thể áp dụng mã giảm giá.",
                "statusCode" => 400,
            ], 400);
        }

        if (!$coupon) {
            return response()->json([
                "message" => "Mã khuyến mãi không tồn tại.",
                "statusCode" => 400,
            ], 400);
        }

        $od2      = Order::where('customer_id', $customerId)->first();
        if ($od2 && ($coupon->new_customer === 1)) {
            return response()->json([
                "message" => "Mã giảm giá chỉ áp dụng cho thành viên mới, vui lòng thử lại sau.",
                "statusCode" => 400,
            ], 400);
        }

        if ($check) {
            return response()->json([
                "message" => "Mã khuyến mãi đã được bạn sử dụng.",
                "statusCode" => 400,
            ], 400);
        }

        if ($coupon->has_expired == 1) {
            $specificDate = Carbon::parse($coupon->expired_at);
            $nowDate      = Carbon::now();
            if (!$nowDate->lte($specificDate)) {
                return response()->json([
                    "message" => "Mã khuyến mãi đã hết hạn sử dụng.",
                    "statusCode" => 400,
                ], 400);
            }
        }

        if ($coupon->quantity - $coupon->quantity_used == 0) {
            return response()->json([
                "message" => "Mã khuyến mãi đã hết lượt sử dụng.",
                "statusCode" => 400,
            ], 400);
        }

        return response()->json([
            "message"    => "Áp dụng mã khuyến mãi $coupon->code thành công.",
            "data"       => $coupon,
            "statusCode" => 200
        ], 200);
    }

    public function show($id)
    {
        $order = $this->order->with('image')->find($id);

        return $order;
    }

    public function findOne($id)
    {
        $order = $this->order->find($id);

        return $order;
    }

    public function update($id, $data)
    {
        $order = $this->findOne($id);
        if ($order->status == 0 && $data['status'] != -1) {
            foreach ($order->childrenOrders as $child) {
                if ($child->sku_id == null) {
                    $product = $this->productService->getProductById($child->product_id);
                    $product->update(['sold_quantity' => ($product->sold_quantity + $child->quantity)]);
                } else {
                    $product = $this->sku->find($child->sku_id);
                    $product->update(['sold_quantity' => ($product->sold_quantity + $child->quantity)]);
                }
            }
        }
        if ($data['status'] == 4) {
            $data['status_payment'] = 1;
        }
        $data['payment_at'] = null;
        if ($data['status_payment'] == 1) {
            $data['payment_at'] = Carbon::now()->toDateTimeString();
        }
        $order->update(['status' => $data['status'], 'status_payment' => $data['status_payment'], 'payment_at' => $data['payment_at']]);

        return $order;
    }

    public function getOrderById($id)
    {
        $order                          = $this->order->with('customer', 'childrenOrders.product', 'product.image', 'childrenOrders')->find($id);
        $order->createdAt               = date('d-m-Y H:i:s', strtotime($order->created_at));
        $order->paymentAt               = date('d-m-Y H:i:s', strtotime($order->payment_at));
        $order->filename                = $order->code . '_' . Str::slug($order->customer->name) . '.pdf';
        $order->status_code             = $order->status;
        $order->status                  = config("constant.status_order_common.$order->status");
        $order->status_payment_code     = $order->status_payment;
        $order->status_payment          = config("constant.status_payment_common.$order->status_payment");
        $order->payment_type            = config("constant.payment_type_common.$order->payment_type");
        $coupon                         = $this->couponService->getCouponById($order->coupon_id);
        $total = 0;
        foreach ($order->childrenOrders as $child) {
            $total += $child->quantity * $child->price;
        }
        $order->discount                = $coupon ? (($coupon->type == 0) ? ((($total * $coupon->value) / 100) > $coupon->value_max ? $coupon->value_max : ($total * $coupon->value) / 100) : $coupon->value) : 0;
        $order->total2                  = $total;

        return $order;
    }

    public function getOrderByCode($code)
    {
        $order                          = $this->order->with('customer', 'childrenOrders.product', 'product.image', 'childrenOrders')->where('code', $code)->first();
        if (!$order) {
            return;
        }
        $order->createdAt               = date('d-m-Y H:i:s', strtotime($order->created_at));
        $order->paymentAt               = date('d-m-Y H:i:s', strtotime($order->payment_at));
        $order->filename                = $order->code . '_' . Str::slug($order->customer->name) . '.pdf';
        $order->status_code             = $order->status;
        $order->status                  = config("constant.status_order_common.$order->status");
        $order->status_payment_code     = $order->status_payment;
        $order->status_payment          = config("constant.status_payment_common.$order->status_payment");
        $order->payment_type            = config("constant.payment_type_common.$order->payment_type");
        $coupon                         = $this->couponService->getCouponById($order->coupon_id);
        $total = 0;
        foreach ($order->childrenOrders as $child) {
            $total += $child->quantity * $child->price;
        }
        $order->discount                = $coupon ? ($coupon->type == 0 ? ($total * $coupon->value) / 100 : $coupon->value) : 0;
        $order->total2                  = $total;

        return $order;
    }

    public function getOrderByEmail($email)
    {
        $order = $this->order->with('image')->where('email', $email)->first();

        return $order;
    }

    public function getOrders()
    {
        $order = $this->order->where('active', config('constant.active'))->with('image')->get();

        return $order;
    }

    public function exportInvoice($user, $orderParent)
    {
        $client = (new Party([
            'name'          => __('common.app_name'),
            'phone'         => '098 765 4321',
            'custom_fields' => [
                'note'        => __('common.app_name'),
                'business id' => __('common.app_name'),
            ],
        ]));

        $customer = (new Party([
            'name'          => $user->name,
            'phone'         => $user->phone,
            'address'       => $orderParent->address,
            'custom_fields' => [
                'Mã hóa đơn' => $orderParent->code,
            ],
        ]));

        $items = [];
        foreach ($orderParent->childrenOrders as $key => $child) {
            $product = $this->productService->getProductById($child->product_id);
            $title   = $product->name;
            $opt     = "";
            if (isset($child->sku_id)) {
                $sku     = $this->sku->with('propertyOptions')->find($child->sku_id);
                foreach ($sku->propertyOptions as $index => $option) {
                    if ($index == 0) {
                        $opt = $opt . $option->name;
                    } else {
                        $opt = $opt . " - " . $option->name;
                    }
                }
            }

            $items[]  = (new InvoiceItem())->title("$title $opt")->pricePerUnit($child->price)->quantity($child->quantity);
        }

        $notes = $orderParent->description ?? 'Đây là hóa đơn điện tử tự động.';

        $invoice = Invoice::make(__('invoices::invoice.invoice'))
            ->seller($client)
            ->buyer($customer)
            ->date($orderParent->created_at)
            ->dateFormat('d/m/Y')
            ->currencyCode('VND')
            ->currencyFormat('{VALUE}đ')
            ->currencyThousandsSeparator('.')
            ->currencyDecimalPoint(',')
            ->filename($orderParent->code . '_' . Str::slug($user->name))
            ->addItems($items)
            ->notes($notes)
            ->logo(public_path('/images/favicon.png'))
            ->save('public');

        $link = $invoice->url();
        return $link;
    }

    public function vnpay($code, $total)
    {
        $vnp_Url = "https://sandbox.vnpayment.vn/paymentv2/vpcpay.html";
        $vnp_Returnurl = "http://localhost:3000/cart/checkout/payment-success";
        $vnp_TmnCode = "NLXP981Z";
        $vnp_HashSecret = "WJBSBDEBXMQXPSUQZWURUMLLALWCVDLI";

        $vnp_TxnRef = $code;
        $vnp_OrderInfo = "Mô tả";
        $vnp_OrderType = "Thanh toán đơn hàng";
        $vnp_Amount = $total * 100;
        $vnp_Locale = "vi-VN";
        $vnp_BankCode = "NCB";
        $vnp_IpAddr = $_SERVER['REMOTE_ADDR'];
        $inputData = array(
            "vnp_Version" => "2.1.0",
            "vnp_TmnCode" => $vnp_TmnCode,
            "vnp_Amount" => $vnp_Amount,
            "vnp_Command" => "pay",
            "vnp_CreateDate" => date('YmdHis'),
            "vnp_CurrCode" => "VND",
            "vnp_IpAddr" => $vnp_IpAddr,
            "vnp_Locale" => $vnp_Locale,
            "vnp_OrderInfo" => $vnp_OrderInfo,
            "vnp_OrderType" => $vnp_OrderType,
            "vnp_ReturnUrl" => $vnp_Returnurl,
            "vnp_TxnRef" => $vnp_TxnRef,
        );

        if (isset($vnp_BankCode) && $vnp_BankCode != "") {
            $inputData['vnp_BankCode'] = $vnp_BankCode;
        }
        if (isset($vnp_Bill_State) && $vnp_Bill_State != "") {
            $inputData['vnp_Bill_State'] = $vnp_Bill_State;
        }

        ksort($inputData);
        $query = "";
        $i = 0;
        $hashdata = "";
        foreach ($inputData as $key => $value) {
            if ($i == 1) {
                $hashdata .= '&' . urlencode($key) . "=" . urlencode($value);
            } else {
                $hashdata .= urlencode($key) . "=" . urlencode($value);
                $i = 1;
            }
            $query .= urlencode($key) . "=" . urlencode($value) . '&';
        }

        $vnp_Url = $vnp_Url . "?" . $query;
        if (isset($vnp_HashSecret)) {
            $vnpSecureHash = hash_hmac('sha512', $hashdata, $vnp_HashSecret); //  
            $vnp_Url .= 'vnp_SecureHash=' . $vnpSecureHash;
        }
        $returnData = array(
            'code' => '00', 'message' => 'success', 'data' => $vnp_Url
        );

        return $returnData;
    }

    public function vnpay2($code)
    {
        $order = $this->getOrderByCode($code);
        $data  = $this->vnpay($order->code, $order->total);

        return response()->json([
            'statusCode'    => 200,
            'url'          => $data['data']
        ], 200);
    }

    public function vnpayIpn($data)
    {
        $inputData      = [];
        $vnp_HashSecret = "WJBSBDEBXMQXPSUQZWURUMLLALWCVDLI";

        foreach ($data as $key => $value) {
            if (substr($key, 0, 4) == "vnp_") {
                $inputData[$key] = $value;
            }
        }

        $vnp_SecureHash = $inputData['vnp_SecureHash'];
        unset($inputData['vnp_SecureHash']);
        ksort($inputData);
        $i = 0;
        $hashData = "";
        foreach ($inputData as $key => $value) {
            if ($i == 1) {
                $hashData = $hashData . '&' . urlencode($key) . "=" . urlencode($value);
            } else {
                $hashData = $hashData . urlencode($key) . "=" . urlencode($value);
                $i = 1;
            }
        }

        $secureHash = hash_hmac('sha512', $hashData, $vnp_HashSecret);
        $vnp_Amount = $inputData['vnp_Amount'] / 100;

        $status = 0;
        $orderCode = $inputData['vnp_TxnRef'];

        if ($secureHash != $vnp_SecureHash) {
            return response()->json([
                'statusCode' => 400,
                'message'    => "Chữ ký không hợp lệ"
            ], 400);
        }

        $order = $this->getOrderByCode($orderCode);
        if (!$order) {
            return response()->json([
                'statusCode' => 400,
                'message'    => "Không tìm thấy đơn hàng"
            ], 400);
        }

        if ($order["total"] != $vnp_Amount) {
            return response()->json([
                'statusCode' => 400,
                'message'    => "Số tiền không hợp lệ"
            ], 400);
        }

        if ($order["status_payment"] == "Đã thanh toán") {
            return response()->json([
                'statusCode' => 400,
                'message'    => "Đơn hàng đã được thanh toán."
            ], 400);
        }

        if ($inputData['vnp_ResponseCode'] != '00' || $inputData['vnp_TransactionStatus'] != '00') {
            return response()->json([
                'statusCode' => 400,
                'message'    => "Thanh toát thất bại."
            ], 400);
        }

        $status = 1;
        $data = [
            'status_payment' => $status,
            'payment_at'     => Carbon::now()
        ];
        $this->payment($order['code'], $data);
        return response()->json([
            'statusCode' => 200,
            'message'    => "Thanh toán thành công."
        ], 200);
    }

    public function store($data)
    {
        foreach ($data['carts'] as $cart) {
            $skuId = $cart['sku_id'];
            $product = ($cart['sku_id'] !== null) ? $this->sku->find($cart['sku_id']) : $this->productService->getProductById($cart['id']);
            $remainQuantity = $product->quantity;

            if ($remainQuantity < $cart['quantity']) {
                $productName = $product->name;
                if ($skuId != null) {
                    $productName = $product->product->name . " phiên bản ";
                    $sku = Sku::with('propertyOptions')->find($skuId);
                    foreach ($sku->propertyOptions as $key => $option) {
                        $productName = $productName . " $option->name";
                    }
                }

                return response()->json([
                    'statusCode' => 400,
                    'message' => "Số lượng còn lại trong kho của sản phẩm $productName không được vượt quá $remainQuantity. Quý khách vui lòng cập nhật lại giỏ hàng để tiếp tục.",
                ], 400);
            }
        }
        $coupon = null;
        if (isset($data['couponCode'])) {
            $coupon = $this->couponService->getCouponByCode($data['couponCode']);
            $customer = $this->customerService->getCustomerById($data['customerId']);
            $cus      = Customer::where('phone', $customer->phone)->withTrashed()->first();
            $od       = Order::where('customer_id', $cus->id)->first();
            $check = $this->customerCoupon->where('customer_id', $data['customerId'])->where('coupon_id', $coupon->id)->first();
            $check2 = $this->customerCoupon->where('customer_id', $cus->id)->where('coupon_id', $coupon->id)->first();

            if ($od && $check2) {
                return response()->json([
                    "message" => "Phát hiện hành vi gian lận, không thể áp dụng mã giảm giá.",
                    "statusCode" => 400,
                ], 400);
            }

            if (!$coupon) {
                return response()->json([
                    "message" => "Mã khuyến mãi không tồn tại.",
                    "statusCode" => 400,
                ], 400);
            }

            $od2      = Order::where('customer_id', $data['customerId'])->first();
            if ($od2 && ($coupon->new_customer === 1)) {
                return response()->json([
                    "message" => "Mã giảm giá chỉ áp dụng cho thành viên mới, vui lòng thử lại sau.",
                    "statusCode" => 400,
                ], 400);
            }

            if ($check) {
                return response()->json([
                    "message" => "Mã khuyến mãi đã được bạn sử dụng.",
                    "statusCode" => 400,
                ], 400);
            }

            if ($coupon->has_expired == 1) {
                $specificDate = Carbon::parse($coupon->expired_at);
                $nowDate      = Carbon::now();
                if (!$nowDate->lte($specificDate)) {
                    return response()->json([
                        "message" => "Mã khuyến mãi đã hết hạn sử dụng.",
                        "statusCode" => 400,
                    ], 400);
                }
            }

            if ($coupon->quantity - $coupon->quantity_used <= 0) {
                return response()->json([
                    "message" => "Mã khuyến mãi đã hết lượt sử dụng.",
                    "statusCode" => 400,
                ], 400);
            }

            return response()->json([
                "message"    => "Áp dụng mã khuyến mãi $coupon->code thành công.",
                "data"       => $coupon,
                "statusCode" => 200
            ], 200);
        }
        $parentOrder = [
            'customer_id'   => $data['customerId'],
            'address'       => $data['address'],
            'description'   => $data['description'],
            'code'          => 'FSTUDIOBYFPT' . random_int(1, 999999) . strtoupper(Str::random(2)),
            'payment_type'  => $data['typePayment'],
            'coupon_id'     => isset($coupon) ? $coupon->id : null,
        ];
        $sku             = $this->sku;
        $productService  = $this->productService;
        $propertyService = $this->propertyService;
        $customerService = $this->customerService;
        $order           = $this->order->create($parentOrder);
        $total           = 0;
        $childOrder = [];
        foreach ($data['carts'] as $cart) {
            $total += (float)($cart['quantity'] * $cart['price']);
            $childOrder[] = [
                'order_id'      => $order->id,
                'product_id'    => $cart['id'],
                'sku_id'        => $cart['sku_id'] >= 0 ? $cart['sku_id'] : null,
                'price'         => $cart['price'],
                'quantity'      => $cart['quantity'],
                'status'        => null,
            ];
        }
        $order->childrenOrders()->createMany($childOrder);
        if ($coupon) {
            $total -= ($coupon->type == 0) ? ((($total * $coupon->value) / 100) > $coupon->value_max ? $coupon->value_max : ($total * $coupon->value) / 100) : $coupon->value;
            $coupon->update(['quantity_used' => $coupon->quantity_used + 1]);
            $this->customerCoupon->create(['coupon_id' => $coupon->id, 'customer_id' => $data['customerId']]);
        }

        $order->update(['total' => $total]);

        $user = $this->customerService->getCustomerById($data['customerId']);
        $link = $this->exportInvoice($user, $order);
        Mail::to($user->email)->send(new MailInvoice($order, $link, $productService, $sku, $propertyService, $customerService));

        return response()->json([
            'statusCode'    => 200,
            'message'       => "Đặt hàng thành công",
            'code'          => $order->code
        ], 200);
    }

    public function payment($code, $data)
    {
        $order = $this->order->where('code', $code)->first();
        $order->update(['status_payment' => $data['status_payment'], 'payment_at' => $data['payment_at']]);

        return $order;
    }

    public function cancelled($code)
    {
        $order = $this->order->where('code', $code)->first();
        $order->update(['status' => config('constant.status_order.cancelled')]);

        return response()->json([
            'statusCode'    => 200,
            'message'       => "Hủy đặt hàng thành công!",
            'code'          => $order->code
        ], 200);
    }

    public function delete($id)
    {
        $order = $this->getOrderById($id);
        $order->image()->delete();
        $order->delete();

        return $order;
    }
}
