<?php

namespace App\Services\Admin\Coupon;

use App\Models\Coupon;
use Carbon\Carbon;
use Illuminate\Support\Facades\Log;

class CouponService
{
    protected $coupon;

    public function __construct(
        Coupon $coupon
    ) {
        $this->coupon = $coupon;
    }

    public function index($params)
    {
        $coupons = $this->coupon->orderBy($params['sort_key'] ?? 'id', $params['order_by'] ?? 'DESC');

        if (isset($params['keywords'])) {
            $coupons = $coupons->where('name', 'LIKE', '%' . $params['keywords'] . '%')
                ->orWhere('code', 'LIKE', '%' . $params['keywords'] . '%');
        }

        if (isset($params['per_page'])) {
            $coupons = $coupons
                ->paginate(
                    $params['per_page'],
                    ['*'],
                    'page',
                    $params['page'] ?? 1
                );
        } else {
            $coupons = $coupons->get();
        }

        $coupons->map(function ($coupon) {
            $coupon->name           = limitTo($coupon->name, 10);
            $coupon->expired_at     = Carbon::parse($coupon->expired_at)->format("m-d-Y");
            $coupon->type           = config("constant.type_coupon_common.$coupon->type");
            $coupon->quantity       = $coupon->quantity - $coupon->quantity_used;
            $coupon->has_expired    = $coupon->has_expired === 1 ? true : false;
            $coupon->description    = limitTo($coupon->description, 10);
        });

        return $coupons;
    }

    public function active($id, $data)
    {
        $coupon = $this->getCouponById($id);
        $coupon->update(['active' => $data['active']]);

        return $coupon;
    }

    public function show($id)
    {
        $coupon = $this->coupon->find($id);

        return $coupon;
    }

    public function getCouponById($id)
    {
        $coupon = $this->coupon->find($id);

        return $coupon;
    }

    public function getCouponByCode($code)
    {
        $coupon = $this->coupon->where('code', $code)->where('active', config('constant.active'))->first();

        return $coupon;
    }

    public function getCoupons()
    {
        $coupons = $this->coupon->orderBy('id', 'desc')->where('active', config('constant.active'))->get();
        $coupons->map(function ($coupon) {
            $coupon->expiredDate = Carbon::parse($coupon->expired_at)->format("m-d-Y H:i:s");
            $coupon->has_expired = $coupon->has_expired === 1 ? true : false;
        });

        return $coupons;
    }

    public function store($data)
    {
        $coupon = $this->coupon->create($data);

        return $coupon;
    }

    public function update($id, $data)
    {
        $coupon = $this->getCouponById($id);

        $coupon->update($data);

        return $coupon;
    }

    public function delete($id)
    {
        $coupon = $this->getCouponById($id);
        $coupon->delete();

        return $coupon;
    }
}
