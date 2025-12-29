<div bgcolor="#E4E4E4" style="background-color:#e4e4e4;margin:0;padding:30px 0 30px 0;width:100%!important">
    <table width="100%" bgcolor="#E4E4E4" style="background-color:#e4e4e4" border="0" cellpadding="0" cellspacing="0"
        role="presentation">
        <tbody>
        <tr>
            <td>
                <table align="center" border="0" cellpadding="0" cellspacing="0" role="presentation"
                    style="width:60%">
                    <tbody>
                    <tr>
                        <td bgcolor="#ffffff"
                            style="border-top:4px solid #1d5faa;background-color:#ffffff;padding-bottom:60px">
                            <table align="center" width="500" border="0" cellpadding="0" cellspacing="0"
                                role="presentation"
                                style="width:500px">
                                <tbody>
                                <tr>
                                    <td>
                                        <div id="header" style="padding: 20px 0">
                                            <div class="logo-wrapper" style="display: flex;">
                                                <img class="logo"
                                                    src="{{ asset('images/logo.png') }}"
                                                    alt=""
                                                    style="width: auto;">
                                            </div>
                                        </div>

                                        <div id="body" style="background: #fff; padding: 0">
                                            <p>{{ $username }}</p>
                                            <p>{{ $welcome }}</p>
                                            <p>{{ $content }}</p>
                                            <div class="panel" style="border-left: #2d3748 solid 4px; margin: 21px 0;">
                                                <div class="panel-content"
                                                    style="background-color: #edf2f7; color: #718096; padding: 16px;">
                                                    <div class="panel-item"
                                                        style="padding: 0; font-size: 24px; font-weight: bold; color: #333;">{{ $verifyCode }}</div>
                                                </div>
                                            </div>
                                            <br>
                                            <p>＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝</p>
                                            <p>{{ $footer }}</p>
                                        </div>
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
</div>
