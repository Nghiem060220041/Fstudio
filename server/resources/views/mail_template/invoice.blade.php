<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Xác nhận Đơn Hàng từ {{ __('common.app_name') }}</title>
</head>

<body>
    <table width="100%" bgcolor="#ffffff" cellpadding="0" cellspacing="0" border="0"
        id="m_7148987284169429276backgroundTable">
        <tbody>
            <tr>
                <td>
                    <table width="600" cellpadding="0" cellspacing="0" border="0" align="center">
                        <tbody>
                            <tr>
                                <td width="100%">
                                    <table bgcolor="#ffffff" width="600" cellpadding="0" cellspacing="0"
                                        border="0" align="center">
                                        <tbody>
                                            <tr>
                                                <td>
                                                    <table width="560" align="center" cellpadding="0" cellspacing="0"
                                                        border="0">
                                                        <tbody>

                                                            <tr>
                                                                <td align="center"><img
                                                                        src="https://utfs.io/f/4bc4528f-d220-4441-b5d3-f3bb9d8fd599-hru0oc.png">
                                                                </td>
                                                            </tr>

                                                            <tr>
                                                                <td height="10"
                                                                    style="font-size:1px;line-height:1px">&nbsp;</td>
                                                            </tr>

                                                        </tbody>
                                                    </table>
                                                </td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </td>
            </tr>
        </tbody>
    </table>
    <table width="100%" bgcolor="#ffffff" cellpadding="0" cellspacing="0" border="0"
        id="m_7148987284169429276backgroundTable">
        <tbody>
            <tr>
                <td>
                    <table width="600" cellpadding="0" cellspacing="0" border="0" align="center">
                        <tbody>
                            <tr>
                                <td width="100%">
                                    <table bgcolor="#ffffff" width="600" cellpadding="0" cellspacing="0"
                                        border="0" align="center">
                                        <tbody>

                                            <tr>
                                                <td height="10" style="font-size:1px;line-height:1px">&nbsp;</td>
                                            </tr>

                                            <tr>
                                                <td>
                                                    <table width="560" align="center" cellpadding="0" cellspacing="0"
                                                        border="0">
                                                        <tbody>
                                                            <tr>
                                                                <td
                                                                    style="font-family:Helvetica,arial,sans-serif;font-size:13px;color:#000000;text-align:left;line-height:18px">
                                                                    Xin chào
                                                                    {{ $customerService->getCustomerById($invoiceData['customer_id'])->name }},
                                                                </td>
                                                            </tr>
                                                            <tr>
                                                                <td width="100%" height="10"
                                                                    style="font-size:1px;line-height:1px">&nbsp;</td>
                                                            </tr>

                                                            <tr>
                                                                <td
                                                                    style="font-family:Helvetica,arial,sans-serif;font-size:13px;color:#000000;text-align:left;line-height:18px">

                                                                    Đơn hàng <a href="#"
                                                                        style="text-decoration:none;color:#ff5722"
                                                                        target="_blank"
                                                                        data-saferedirecturl="#">#{{ $invoiceData['code'] }}</a>
                                                                    của bạn đã được đặt thành
                                                                    công ngày
                                                                    {{ \Carbon\Carbon::parse($invoiceData['created_at'])->format('d-m-Y') }}.
                                                                    <br><br>
                                                                    Bạn có thể theo dõi mã đơn hàng này tại website của
                                                                    chúng tôi.
                                                                </td>
                                                            </tr>

                                                            <tr>
                                                                <td width="100%" height="10"
                                                                    style="font-size:1px;line-height:1px">&nbsp;</td>
                                                            </tr>
                                                        </tbody>
                                                    </table>
                                                </td>
                                            </tr>
                                            <tr>
                                                <td width="100%" height="1" bgcolor="#ffffff"
                                                    style="font-size:1px;line-height:1px">&nbsp;</td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </td>
            </tr>
        </tbody>
    </table>
    <div style="width:100%;height:1px;display:block" align="center">
        <div style="width:100%;max-width:600px;height:1px;border-top:1px solid #e0e0e0"></div>
    </div>
    <table width="100%" bgcolor="#ffffff" cellpadding="0" cellspacing="0" border="0"
        id="m_7148987284169429276backgroundTable">
        <tbody>
            <tr>
                <td>
                    <table width="600" cellpadding="0" cellspacing="0" border="0" align="center">
                        <tbody>
                            <tr>
                                <td width="100%">
                                    <table bgcolor="#ffffff" width="600" cellpadding="0" cellspacing="0"
                                        border="0" align="center">
                                        <tbody>

                                            <tr>
                                                <td height="10" style="font-size:1px;line-height:1px">&nbsp;</td>
                                            </tr>

                                            <tr>
                                                <td>
                                                    <table width="560" align="center" cellpadding="0" cellspacing="0"
                                                        border="0">
                                                        <tbody>


                                                            <tr>
                                                                <td colspan="2"
                                                                    style="text-align:left;font-family:Helvetica,arial,sans-serif;color:#1f1f1f;font-size:16px;font-weight:bold;height:10px">
                                                                </td>
                                                            </tr>
                                                            <tr>
                                                                <td colspan="2"
                                                                    style="text-align:left;font-family:Helvetica,arial,sans-serif;color:#1f1f1f;font-size:13px;font-weight:bold">
                                                                    THÔNG TIN ĐƠN HÀNG - DÀNH CHO NGƯỜI MUA
                                                                </td>
                                                            </tr>
                                                            <tr>
                                                                <td height=""
                                                                    style="font-size:1px;line-height:1px"
                                                                    width="100%">&nbsp;</td>
                                                            </tr>


                                                        </tbody>
                                                    </table>
                                                </td>
                                            </tr>
                                            <tr>
                                                <td width="100%" height="1" bgcolor="#ffffff"
                                                    style="font-size:1px;line-height:1px">&nbsp;</td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </td>
            </tr>
        </tbody>
    </table>
    <table width="100%" bgcolor="#ffffff" cellpadding="0" cellspacing="0" border="0"
        id="m_7148987284169429276backgroundTable">
        <tbody>
            <tr>
                <td>
                    <table width="600" cellpadding="0" cellspacing="0" border="0" align="center">
                        <tbody>
                            <tr>
                                <td width="100%">
                                    <table bgcolor="#ffffff" width="600" cellpadding="0" cellspacing="0"
                                        border="0" align="center">
                                        <tbody>

                                            <tr>
                                                <td height="10" style="font-size:1px;line-height:1px">&nbsp;</td>
                                            </tr>

                                            <tr>
                                                <td>
                                                    <table width="560" align="center" cellpadding="0"
                                                        cellspacing="0" border="0">
                                                        <tbody>

                                                            <tr>
                                                                <td style="word-break:break-word;text-align:left;font-family:Helvetica,arial,sans-serif;font-size:13px;color:#000000;vertical-align:top"
                                                                    width="49%">Mã đơn hàng:
                                                                </td>
                                                                <td style="word-break:break-word;text-align:left;font-family:Helvetica,arial,sans-serif;font-size:13px;color:#000000;vertical-align:top"
                                                                    width="49%">
                                                                    <a href="#"
                                                                        style="text-align:left;font-family:Helvetica,arial,sans-serif;font-size:13px;color:#ff5722;vertical-align:top;width:280px"
                                                                        target="_blank"
                                                                        data-saferedirecturl="#">#{{ $invoiceData['code'] }}</a>

                                                                </td>
                                                            </tr>
                                                            <tr>
                                                                <td style="word-break:break-word;text-align:left;font-family:Helvetica,arial,sans-serif;font-size:13px;color:#000000;vertical-align:top"
                                                                    width="49%">Ngày đặt hàng:
                                                                </td>
                                                                <td style="word-break:break-word;text-align:left;font-family:Helvetica,arial,sans-serif;font-size:13px;color:#000000;vertical-align:top"
                                                                    width="49%">
                                                                    {{ \Carbon\Carbon::parse($invoiceData['created_at'])->format('d-m-Y H:m:s') }}
                                                                </td>
                                                            </tr>
                                                            <tr>
                                                                <td colspan="2" height="20"
                                                                    style="font-size:1px;line-height:1px"
                                                                    width="100%">
                                                                    &nbsp;
                                                                </td>
                                                            </tr>

                                                        </tbody>
                                                    </table>
                                                </td>
                                            </tr>
                                            <tr>
                                                <td width="100%" height="1" bgcolor="#ffffff"
                                                    style="font-size:1px;line-height:1px">&nbsp;</td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </td>
            </tr>
        </tbody>
    </table>
    @php
        $total = 0;
    @endphp
    @foreach ($invoiceData->childrenOrders as $index => $item)
    @php
        $total += $item->quantity * $item->price;
    @endphp
        <table width="100%" bgcolor="#ffffff" cellpadding="0" cellspacing="0" border="0"
            id="m_7148987284169429276backgroundTable">
            <tbody>
                <tr>
                    <td>
                        <table width="600" cellpadding="0" cellspacing="0" border="0" align="center">
                            <tbody>
                                <tr>
                                    <td width="100%">
                                        <table bgcolor="#ffffff" width="600" cellpadding="0" cellspacing="0"
                                            border="0" align="center">
                                            <tbody>

                                                <tr>
                                                    <td height="10" style="font-size:1px;line-height:1px">&nbsp;
                                                    </td>
                                                </tr>

                                                <tr>
                                                    <td>
                                                        <table width="560" align="center" cellpadding="0"
                                                            cellspacing="0" border="0">
                                                            <tbody>
                                                                <tr>
                                                                    <td>
                                                                        <table width="560" align="center"
                                                                            border="0" cellpadding="0"
                                                                            cellspacing="0">
                                                                            <tbody>
                                                                                <tr>
                                                                                    <td width="560" height="140"
                                                                                        align="left">
                                                                                        <a href="#"
                                                                                            target="_blank"
                                                                                            data-saferedirecturl="#">
                                                                                            <img src="{{ $productService->getProductById($item->product_id)->image->path }}"
                                                                                                alt=""
                                                                                                border="0"
                                                                                                width="140"
                                                                                                height="140"
                                                                                                style="display:block;border:none;outline:none;text-decoration:none"
                                                                                                class="CToWUd"
                                                                                                data-bit="iit">
                                                                                        </a>
                                                                                    </td>
                                                                                </tr>

                                                                            </tbody>
                                                                        </table>
                                                                        <table align="left" border="0"
                                                                            cellpadding="0" cellspacing="0">
                                                                            <tbody>
                                                                                <tr>
                                                                                    <td width="100%" height="10"
                                                                                        style="font-size:1px;line-height:1px">
                                                                                        &nbsp;</td>
                                                                                </tr>

                                                                            </tbody>
                                                                        </table>
                                                                        <table width="560" align="center"
                                                                            cellpadding="0" cellspacing="0"
                                                                            border="0" style="table-layout:fixed">
                                                                            <tbody>
                                                                                <tr>
                                                                                    <td colspan="2" width=""
                                                                                        height="20"
                                                                                        style="font-size:1px;line-height:1px">
                                                                                        &nbsp;</td>
                                                                                </tr>
                                                                                <tr>
                                                                                    <td colspan="2"
                                                                                        style="font-family:Helvetica,arial,sans-serif;font-size:13px;color:#000000;text-align:left">
                                                                                        {{ $index + 1 }}.
                                                                                        {{ $productService->getProductById($item->product_id)->name }}
                                                                                    </td>
                                                                                </tr>
                                                                                @if ($item->sku_id != null)
                                                                                    <tr>
                                                                                        <td style="word-break:break-word;text-align:left;font-family:Helvetica,arial,sans-serif;font-size:13px;color:#000000;vertical-align:top"
                                                                                            width="49%">Mẫu mã:
                                                                                        </td>
                                                                                        <td style="word-break:break-word;text-align:left;font-family:Helvetica,arial,sans-serif;font-size:13px;color:#000000;vertical-align:top"
                                                                                            width="49%">
                                                                                            @php
                                                                                                $options = $sku->with('propertyOptions')->find($item->sku_id);
                                                                                                $opt = '';
                                                                                                foreach ($options->propertyOptions as $key => $option) {
                                                                                                    if ($key == 0) {
                                                                                                        $opt = "$opt $option->name";
                                                                                                    } else {
                                                                                                        $opt = "$opt, $option->name";
                                                                                                    }
                                                                                                }
                                                                                            @endphp
                                                                                            {{ $opt }}
                                                                                        </td>
                                                                                    </tr>
                                                                                @endif
                                                                                <tr>
                                                                                    <td style="word-break:break-word;text-align:left;font-family:Helvetica,arial,sans-serif;font-size:13px;color:#000000;vertical-align:top"
                                                                                        width="49%">Số lượng: </td>
                                                                                    <td style="word-break:break-word;text-align:left;font-family:Helvetica,arial,sans-serif;font-size:13px;color:#000000;vertical-align:top"
                                                                                        width="49%">
                                                                                        {{ number_format($item->quantity, 0, ',', '.') }}
                                                                                    </td>
                                                                                </tr>

                                                                                <tr>
                                                                                    <td style="word-break:break-word;text-align:left;font-family:Helvetica,arial,sans-serif;font-size:13px;color:#000000;vertical-align:top"
                                                                                        width="49%">Giá: </td>
                                                                                    <td style="word-break:break-word;text-align:left;font-family:Helvetica,arial,sans-serif;font-size:13px;color:#000000;vertical-align:top"
                                                                                        width="49%">
                                                                                        ₫{{ number_format($item->price, 0, ',', '.') }}
                                                                                    </td>
                                                                                </tr>
                                                                                <tr>
                                                                                    <td width="100%" height="10"
                                                                                        style="font-size:1px;line-height:1px">
                                                                                        &nbsp;</td>
                                                                                </tr>

                                                                            </tbody>
                                                                        </table>

                                                                    </td>
                                                                </tr>
                                                            </tbody>
                                                        </table>
                                                    </td>
                                                </tr>
                                                <tr>
                                                    <td width="100%" height="1" bgcolor="#ffffff"
                                                        style="font-size:1px;line-height:1px">&nbsp;</td>
                                                </tr>
                                            </tbody>
                                        </table>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </td>
                </tr>
            </tbody>
        </table>
    @endforeach
    <div style="width:100%;height:1px;display:block" align="center">
        <div style="width:100%;max-width:600px;height:1px;border-top:1px solid #e0e0e0"></div>
    </div>
    <table width="100%" bgcolor="#ffffff" cellpadding="0" cellspacing="0" border="0"
        id="m_7169669308194186931backgroundTable">
        <tbody>
            <tr>
                <td>
                    <table width="600" cellpadding="0" cellspacing="0" border="0" align="center">
                        <tbody>
                            <tr>
                                <td width="100%">
                                    <table bgcolor="#ffffff" width="600" cellpadding="0" cellspacing="0"
                                        border="0" align="center">
                                        <tbody>

                                            <tr>
                                                <td height="10" style="font-size:1px;line-height:1px">&nbsp;</td>
                                            </tr>

                                            <tr>
                                                <td>
                                                    <table width="560" align="center" cellpadding="0"
                                                        cellspacing="0" border="0">
                                                        <tbody>

                                                            <tr>
                                                                <td>
                                                                    <table width="560" align="center"
                                                                        cellpadding="0" cellspacing="0"
                                                                        border="0" style="table-layout:fixed">
                                                                        <tbody>
                                                                            <tr>
                                                                                <td colspan="2"
                                                                                    style="text-align:left;font-family:Helvetica,arial,sans-serif;color:#1f1f1f;font-size:16px;font-weight:bold;height:10px">
                                                                                </td>
                                                                            </tr>
                                                                            <tr>
                                                                                <td style="word-break:break-word;text-align:left;font-family:Helvetica,arial,sans-serif;font-size:13px;color:#000000;vertical-align:top"
                                                                                    width="49%">Tổng tiền:
                                                                                </td>
                                                                                <td style="word-break:break-word;text-align:left;font-family:Helvetica,arial,sans-serif;font-size:13px;color:#000000;vertical-align:top"
                                                                                    width="49%">
                                                                                    ₫{{ number_format($total, 0, ',', '.') }}
                                                                                </td>
                                                                            </tr>
                                                                            <tr>
                                                                                <td style="word-break:break-word;text-align:left;font-family:Helvetica,arial,sans-serif;font-size:13px;color:#000000;vertical-align:top"
                                                                                    width="49%">Giảm giá:
                                                                                </td>
                                                                                <td style="word-break:break-word;text-align:left;font-family:Helvetica,arial,sans-serif;font-size:13px;color:#000000;vertical-align:top"
                                                                                    width="49%">₫{{ number_format($total-$invoiceData['total'], 0, ',', '.') }}
                                                                                </td>
                                                                            </tr>
                                                                            <tr>
                                                                                <td style="word-break:break-word;text-align:left;font-family:Helvetica,arial,sans-serif;font-size:13px;color:#000000;vertical-align:top"
                                                                                    width="49%">Tổng thanh toán:
                                                                                </td>
                                                                                <td style="word-break:break-word;text-align:left;font-family:Helvetica,arial,sans-serif;font-size:13px;color:#000000;vertical-align:top"
                                                                                    width="49%">
                                                                                    ₫{{ number_format($invoiceData['total'], 0, ',', '.') }}
                                                                                </td>
                                                                            </tr>
                                                                            <tr>
                                                                                <td colspan="2"
                                                                                    style="text-align:left;font-family:Helvetica,arial,sans-serif;color:#1f1f1f;font-size:16px;font-weight:bold;height:10px">
                                                                                </td>
                                                                            </tr>
                                                                            <tr>
                                                                                <td colspan="2"
                                                                                    style="text-align:left;font-family:Helvetica,arial,sans-serif;color:#1f1f1f;font-size:16px;font-weight:bold;height:10px">
                                                                                </td>
                                                                            </tr>

                                                                        </tbody>
                                                                    </table>

                                                                </td>
                                                            </tr>
                                                        </tbody>
                                                    </table>
                                                </td>
                                            </tr>
                                            <tr>
                                                <td width="100%" height="1" bgcolor="#ffffff"
                                                    style="font-size:1px;line-height:1px">&nbsp;</td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </td>
            </tr>
        </tbody>
    </table>
    <div style="width:100%;height:1px;display:block" align="center">
        <div style="width:100%;max-width:600px;height:1px;border-top:1px solid #e0e0e0"></div>
    </div>
    <table width="100%" bgcolor="#ffffff" cellpadding="0" cellspacing="0" border="0"
        id="m_7169669308194186931backgroundTable">
        <tbody>
            <tr>
                <td>
                    <table width="600" cellpadding="0" cellspacing="0" border="0" align="center">
                        <tbody>
                            <tr>
                                <td width="100%">
                                    <table bgcolor="#ffffff" width="600" cellpadding="0" cellspacing="0"
                                        border="0" align="center">
                                        <tbody>

                                            <tr>
                                                <td height="10" style="font-size:1px;line-height:1px">&nbsp;</td>
                                            </tr>

                                            <tr>
                                                <td>
                                                    <table width="560" align="center" cellpadding="0"
                                                        cellspacing="0" border="0">
                                                        <tbody>


                                                            <tr>
                                                                <td
                                                                    style="font-family:Helvetica,arial,sans-serif;font-weight:bold;font-size:13px;color:#1f1f1f;text-align:left;line-height:18px">
                                                                    BƯỚC TIẾP THEO
                                                                </td>
                                                            </tr>
                                                            <tr>
                                                                <td width="100%" height="10"
                                                                    style="font-size:1px;line-height:1px">&nbsp;</td>
                                                            </tr>
                                                            <tr>
                                                                <td
                                                                    style="font-family:Helvetica,arial,sans-serif;font-size:13px;color:#000000;text-align:left;line-height:18px">

                                                                    Bạn không hài lòng về sản phẩm? <br>
                                                                    Bạn có thể gửi <a href="#"
                                                                        style="text-decoration:none;color:#ff5722"
                                                                        target="_blank" data-saferedirecturl="#">yêu
                                                                        cầu trả hàng</a> trên website của chúng tôi
                                                                    trong
                                                                    vòng 3 ngày kể từ khi nhận được email
                                                                    này.<br><br>
                                                                </td>
                                                            </tr>

                                                            <tr>
                                                                <td width="100%" height="10"
                                                                    style="font-size:1px;line-height:1px">&nbsp;</td>
                                                            </tr>

                                                            <tr>
                                                                <td colspan="2">
                                                                    <table border="0" cellspacing="0"
                                                                        cellpadding="0" align="center">
                                                                        <tbody>
                                                                            <tr>
                                                                                <td bgcolor="#ffffff"
                                                                                    style="border:2px solid;border-color:#ee4d2d;padding:8px 13px 8px 13px;border-radius:3px"
                                                                                    align="center"><a
                                                                                        href="{{ asset('storage/' . pathinfo($url, PATHINFO_BASENAME)) }}"
                                                                                        style="font-size:14px;font-family:Helvetica,Arial,sans-serif;font-weight:normal;color:#ee4d2d;text-decoration:none;display:inline-block"
                                                                                        target="_blank"
                                                                                        data-saferedirecturl="{{ asset('storage/' . pathinfo($url, PATHINFO_BASENAME)) }}"
                                                                                        download>
                                                                                        Tải xuống hóa đơn </a></td>
                                                                            </tr>
                                                                        </tbody>
                                                                    </table>
                                                                </td>
                                                            </tr>

                                                            <tr>
                                                                <td width="100%" height="10"
                                                                    style="font-size:1px;line-height:1px">&nbsp;</td>
                                                            </tr>
                                                            <tr>
                                                                <td><br>
                                                                </td>
                                                            </tr>
                                                            <tr>
                                                                <td
                                                                    style="font-family:Helvetica,arial,sans-serif;font-size:13px;color:#000000;text-align:left;line-height:18px">
                                                                    <br>
                                                                    Trân trọng,<br>
                                                                    Đội ngũ {{ __('common.app_name') }}
                                                                </td>
                                                            </tr>


                                                            <tr>
                                                                <td
                                                                    style="font-family:Helvetica,arial,sans-serif;font-size:13px;color:#000000;text-align:left;line-height:18px">
                                                                    <br>
                                                                    Bạn có thắc mắc? Liên hệ chúng tôi <a
                                                                        href="#"
                                                                        style="text-decoration:underline!important;color:#ff5722"
                                                                        target="_blank" data-saferedirecturl="#">tại
                                                                        đây</a>.
                                                                </td>
                                                            </tr>
                                                        </tbody>
                                                    </table>
                                                </td>
                                            </tr>
                                            <tr>
                                                <td width="100%" height="1" bgcolor="#ffffff"
                                                    style="font-size:1px;line-height:1px">&nbsp;</td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </td>
            </tr>
        </tbody>
    </table>
</body>

</html>
