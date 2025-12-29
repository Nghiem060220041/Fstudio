<?php

namespace App\Mail\Web;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Mail\Mailable;
use Illuminate\Queue\SerializesModels;

class MailResetPassword extends Mailable implements ShouldQueue
{
    use Queueable, SerializesModels;

    protected $user;
    protected $otpCode;

    public function __construct($user, $otpCode)
    {
        $this->user = $user;
        $this->otpCode = $otpCode;
    }

    public function build()
    {
        return $this->view('mail_template.reset_password')
            ->subject(__('Đặt lại mật khẩu'))
            ->with([
                'username' =>  __('Xin chào, ', ['username' => $this->user->name]),
                'verifyCode' => $this->otpCode,
                'welcome' => __('Cảm ơn bạn đã sử dụng dịch vụ của chúng tôi. Chúng tôi đã nhận được yêu cầu đặt lại mật khẩu của bạn.'),
                'content' => __('Vui lòng sử dụng mã xác minh dưới đây để đặt lại mật khẩu của bạn.'),
                'footer' => __('Email này được gửi từ địa chỉ email chỉ để gửi. Vui lòng không trả lời email này.'),
            ]);
    }
}
