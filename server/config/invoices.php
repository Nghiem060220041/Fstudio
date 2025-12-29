<?php

return [
    'date' => [
        'format' => 'd-m-Y',
        'pay_until_days' => 14,
    ],

    'serial_number' => [
        'series'   => 'FSTUDIOVYFPT',
        'sequence' => 1,
        'sequence_padding' => 5,
        'delimiter'        => '.',
        'format' => '{SERIES}{DELIMITER}{SEQUENCE}',
    ],

    'currency' => [
        'code' => 'đồng',
        'fraction' => 'đồng',
        'symbol'   => '₫',
        'decimals' => 0,
        'decimal_point' => '',
        'thousands_separator' => '',
        'format' => '{VALUE}đ',
    ],

    'paper' => [
        'size'        => 'a4',
        'orientation' => 'portrait',
    ],

    'disk' => 'local',

    'seller' => [
        'class' => \LaravelDaily\Invoices\Classes\Seller::class,
        'attributes' => [
            'name'          => 'Nguyen Van A',
            'address'       => 'Ha Noi Viet Nam',
            'code'          => '1000000',
            'vat'           => '123456789',
            'phone'         => '034-567-8910',
            'custom_fields' => [
                'SWIFT' => 'BANK101',
            ],
        ],
    ],

    'dompdf_options' => [
        'enable_php' => true,
        'logOutputFile' => '/dev/null',
    ],
];
