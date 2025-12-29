<?php

namespace App\Mail;

use App\Models\Sku;
use App\Services\Admin\Customer\CustomerService;
use App\Services\Admin\Product\ProductService;
use App\Services\Admin\Property\PropertyService;
use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;

class Invoice extends Mailable
{
    use Queueable, SerializesModels;
    public $invoiceData;
    public $url;
    public $productService;
    public $propertyService;
    public $customerService;
    public $sku;

    public function __construct(
        $invoiceData,
        $url,
        ProductService $productService,
        Sku $sku,
        PropertyService $propertyService,
        CustomerService $customerService,
    ) {
        $this->invoiceData     = $invoiceData;
        $this->url             = $url;
        $this->sku             = $sku;
        $this->productService  = $productService;
        $this->propertyService = $propertyService;
        $this->customerService = $customerService;
    }

    public function envelope(): Envelope
    {
        $code = $this->invoiceData->code;
        return new Envelope(
            subject: "Đơn hàng #$code đã đặt thành công!",
        );
    }

    public function content(): Content
    {
        return new Content(
            view: 'mail_template.invoice',
        );
    }

    public function attachments(): array
    {
        return [];
    }
}
