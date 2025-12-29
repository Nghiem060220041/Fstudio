<?php

namespace App\Services\Admin\Customer;

use App\Models\Customer;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Log;
use Kjmtrue\VietnamZone\Models\District;
use Kjmtrue\VietnamZone\Models\Province;
use Kjmtrue\VietnamZone\Models\Ward;

class CustomerService
{
    protected $customer;

    public function __construct(
        Customer $customer
    ) {
        $this->customer = $customer;
    }

    public function index($params)
    {
        $customers = $this->customer->with('image')->orderBy($params['sort_key'] ?? 'id', $params['order_by'] ?? 'DESC');

        if (isset($params['keywords'])) {
            $customers = $customers->where('phone', 'LIKE', '%' . $params['keywords'] . '%')->Orwhere('name', 'LIKE', '%' . $params['keywords'] . '%');
        }

        if (isset($params['per_page'])) {
            $customers = $customers
                ->paginate(
                    $params['per_page'],
                    ['*'],
                    'page',
                    $params['page'] ?? 1
                );
        } else {
            $customers = $customers->get();
        }

        if (isset($params['active'])) {
            $customers = $customers->where('active', $params['active']);
        }

        $customers->map(function ($customer) {
            $customer->name        = limitTo($customer->name, 10);
            $ward                  = "";
            $district              = "";
            $province              = "";
            if (isset($customer->ward_id)) {
                $ward = Ward::find($customer->ward_id)->name;
            }
            if (isset($customer->district_id)) {
                $district = District::find($customer->district_id)->name;
            }
            if (isset($customer->province_id)) {
                $province = Ward::find($customer->province_id)->name;
            }
            $customer->address  = $customer->address . ', ' . $ward . ', ' . $district . ', ' . $province;
        });

        return $customers;
    }

    public function show($id)
    {
        $customer = $this->customer->with('image')->find($id);

        return $customer;
    }

    public function getCustomerById($id)
    {
        $customer = $this->customer->with('image')->find($id);

        return $customer;
    }

    public function getCustomerByEmail($email)
    {
        $customer = $this->customer->with('image')->where('email', $email)->first();

        return $customer;
    }

    public function getCustomers()
    {
        $customer = $this->customer->where('active', config('constant.active'))->with('image')->get();

        return $customer;
    }

    public function store($data)
    {
        $customer = $this->customer->create($data);

        return $customer;
    }

    public function update($id, $data)
    {
        $customer = $this->getCustomerById($id);
        if(isset($data['password'])){
            $data['password']  = Hash::make($data['password']);
        }
        $customer->update($data);

        return $customer;
    }

    public function active($id, $data)
    {
        $customer = $this->getCustomerById($id);
        $customer->update(['active' => $data['active']]);

        return $customer;
    }

    public function delete($id)
    {
        $customer = $this->getCustomerById($id);
        $customer->delete();

        return $customer;
    }
}
