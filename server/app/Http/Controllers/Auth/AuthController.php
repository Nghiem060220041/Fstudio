<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Http\Requests\Auth\GetPasswordRequest;
use App\Http\Requests\Auth\LoginRequest;
use App\Http\Requests\Auth\ResetPasswordRequest;
use App\Mail\Web\MailResetPassword;
use App\Models\PasswordReset;
use App\Models\User;
use App\Repositories\Interface\AuthRepositoryInterface;
use App\Repositories\Interface\UserRepositoryInterface;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Str;
use Tymon\JWTAuth\Facades\JWTAuth;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\Validator;

class AuthController extends Controller
{
    protected $authRepository;
    protected $userRepository;

    public function __construct(
        AuthRepositoryInterface $authRepository,
        UserRepositoryInterface $userRepository,
    ) {
        $this->middleware('auth:api', ['except' => ['login', 'register', 'refresh', 'getReset', 'postReset']]);

        $this->authRepository = $authRepository;
        $this->userRepository = $userRepository;
    }

    public function loginUser($user, $refreshToken, $refreshTokenExpiry)
    {
        $user->refresh_token = $refreshToken;
        $user->refresh_token_expried = $refreshTokenExpiry;
        $user->access_token = JWTAuth::fromUser($user);
        $user->update();

        return $user->access_token;
    }

    public function getReset(GetPasswordRequest $request)
    {
        $data = $request->all();
        if (isset($data['email']) || isset($data['phone'])) {
            if (isset($data['email'])) {
                $user = User::where('email', $data['email'])->first();
            }

            if (isset($data['phone'])) {
                $phone = $data['phone'];
                $user = User::where('phone', 'LIKE',  "%$phone%")->first();
            }

            if ($user) {
                $otpCode = rand(100000, 999999);

                $passwordReset = PasswordReset::updateOrCreate(
                    ['email' => $user->email],
                    [
                        'token' => $otpCode,
                        'created_at' => now(),
                    ]
                );

                if ($passwordReset) {
                    Mail::to($user)->queue(new MailResetPassword($user, $otpCode));
                    return response()->json([
                        'statusCode' => 200,
                        'message' => "Gửi email thành công, vui lòng check email để lấy mã đặt lại mật khẩu."
                    ], 200);
                }
            } else {
                return response()->json([
                    'statusCode' => 400,
                    'message'     => "Không tìm thấy tài khoản này, vui lòng cung cấp email hoặc số điện thoại chính xác."
                ], 400);
            }
        } else {
            return response()->json([
                'statusCode' => 400,
                'message'     => "Vui lòng cung cấp email hoặc số điện thoại hợp lệ."
            ], 400);
        }
    }

    public function postReset(ResetPasswordRequest $request)
    {
        $data = $request->all();

        $passwordReset = PasswordReset::where('token', $data['otp'])->first();
        if ($passwordReset) {
            if (Carbon::parse($passwordReset->created_at)->addMinutes(5)->isPast()) {
                return response()->json([
                    'statusCode' => 400,
                    'message' => "OTP Đã hết hạn, vui lòng thử lại."
                ], 400);
            }

            $user = User::where('email', $passwordReset->email)->first();
            $user->update([
                'password' => $data['password'],
            ]);
            if ($user) {
                $passwordReset->delete();
                return response()->json([
                    'statusCode' => 200,
                    'message' => "Cập nhật mật khẩu thành công."
                ], 200);
            }
        } else {
            return response()->json([
                'statusCode' => 400,
                'message' => "OTP không chính xác."
            ], 400);
        }
    }

    public function login(LoginRequest $request)
    {
        try {
            $data = $request->only('email', 'password');
            auth()->attempt($data);
            $user = auth()->user();

            if (!$user) {
                return response()->json([
                    'statusCode' => 400,
                    'message' => __('common.auth.failed')
                ], 400);
            }

            if ($user->active != config('constant.active')) {
                return response()->json([
                    'statusCode' => 400,
                    'message' => __('common.auth.inactive')
                ], 400);
            }

            if ($user->deleted_at != null) {
                return response()->json([
                    'statusCode' => 400,
                    'message' => __('common.auth.failed')
                ], 400);
            }

            $refreshToken = Str::random(64);
            $refreshTokenExpiry = now()->addDays(7);

            $userWithTokens = $this->loginUser($user, $refreshToken, $refreshTokenExpiry);

            return response()->json([
                'message' =>  'Đăng nhập thành công',
                'access_token' => $userWithTokens,
                'refresh_token' => $user->refresh_token,
                'user' => $user,
            ], 200);
        } catch (\Throwable $th) {
            Log::info($th->getMessage());
        }
    }

    public function refresh(Request $request)
    {
        $user = $this->userRepository->getUserbyRefreshToken($request->all());
        if (!$user) {
            return response()->json([
                'status' => 1,
                'message' =>  __('api.refresh_token.not_found'),
            ], 400);
        }
        JWTAuth::setToken($user->access_token)->invalidate();
        $token = JWTAuth::fromUser($user);
        $responseData = $this->userRepository->updateRefreshToken($user->id, $token);

        return response()->json([
            'message' =>  'Đăng nhập thành công',
            'access_token' => $token,
            'user' => $user,
            'refresh_token' => $responseData->refresh_token,
        ], 200);
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
