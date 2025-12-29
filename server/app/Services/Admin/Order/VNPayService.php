<?php

namespace App\Services\Admin\Order;

class VNPayService
{
    protected $vnp_Url        = "https://sandbox.vnpayment.vn/paymentv2/vpcpay.html";
    protected $vnp_Returnurl  = "http://localhost:3000/cart/checkout/payment-success";
    protected $vnp_TmnCode    = "NLXP981Z";
    protected $vnp_HashSecret = "WJBSBDEBXMQXPSUQZWURUMLLALWCVDLI";
    protected $unit           = 100;

    public function __construct(
        $vnp_Url,
        $vnp_Returnurl,
        $vnp_TmnCode,
        $vnp_HashSecret,
        $unit
    ) {
        $this->vnp_Url        = $vnp_Url;
        $this->vnp_Returnurl  = $vnp_Returnurl;
        $this->vnp_TmnCode    = $vnp_TmnCode;
        $this->vnp_HashSecret = $vnp_HashSecret;
        $this->unit           = $unit;
    }
}
