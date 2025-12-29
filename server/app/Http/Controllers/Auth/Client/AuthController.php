<?php

namespace App\Http\Controllers\Auth\Client;

use App\Http\Controllers\Controller;
use App\Http\Requests\Auth\Client\RegisterRequest;
use App\Http\Requests\Auth\LoginRequest;
use App\Models\Customer;
use App\Services\Admin\Customer\CustomerService;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Str;

class AuthController extends Controller
{
    protected $customerService;

    public function __construct(
        CustomerService $customerService,
    ) {
        $this->customerService = $customerService;
    }

    public function register(RegisterRequest $request)
    {
        try {
            $data              = $request->all();
            $data['active']    = 1;
            $data['password']  = Hash::make($data['password']);
            $customer          = $this->customerService->store($data);
            if (!$customer) {
                return response()->json([
                    'statusCode' => 400,
                    'message'    => 'Đăng ký thất bại',
                ], 400);
            }
            return response()->json([
                'statusCode' => 200,
                'message'    => 'Đăng ký thành công',
                'customer'   => $customer,
            ], 200);
        } catch (\Throwable $th) {
            Log::info($th->getMessage());
        }
    }

    public function login(LoginRequest $request)
    {
        try {
            $data = $request->only('email', 'password');
            $user = $this->customerService->getCustomerByEmail($data['email']);

            if (!$user) {
                return response()->json([
                    'statusCode' => 400,
                    'message' => "Sai tài khoản hoặc mật khẩu."
                ], 400);
            }

            if ($user->deleted_at != null) {
                return response()->json([
                    'statusCode' => 400,
                    'message' => "Sai tài khoản hoặc mật khẩu"
                ], 400);
            }

            if (!Hash::check($data['password'], $user->password)) {
                return response()->json([
                    'statusCode' => 400,
                    'message' => "Sai tài khoản hoặc mật khẩu"
                ], 400);
            }

            if ($user->active != config('constant.active')) {
                return response()->json([
                    'statusCode' => 400,
                    'message' => "Tài khoản của bạn đã bị tắt kích hoạt."
                ], 400);
            }

            return response()->json([
                'statusCode' => 200,
                'message' =>  'Đăng nhập thành công',
                'user'    => $user,
            ], 200);
        } catch (\Throwable $th) {
            Log::info($th->getMessage());
        }
    }

    public function logout()
    {
        if (auth()->check()) {
            auth()->logout();
            return response()->json([
                'status'  => 'success',
                'message' => __('common.auth.logout_success')
            ], 200);
        }
    }
}
