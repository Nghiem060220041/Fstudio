<?php

return [

    'app' => env('MOMO_APP', 'Fstudio'),
    'currency' => env('MOMO_CURRENCY', 'VND'),
    'environment' => env('MOMO_ENVIRONMENT', 'sandbox'),
    'product' => env('MOMO_PRODUCT', 'collection'),
    'provider_callback_host' => env('MOMO_PROVIDER_CALLBACK_HOST', 'localhost'),

    'api' => [
        'base_uri' => env('MOMO_API_BASE_URI', 'https://ericssonbasicapi2.azure-api.net/'),
        'register_id_uri' => env('MOMO_API_REGISTER_ID_URI', 'v1_0/apiuser'),
        'validate_id_uri' => env('MOMO_API_VALIDATE_ID_URI', 'v1_0/apiuser/{clientId}'),
        'request_secret_uri' => env('MOMO_API_REQUEST_SECRET_URI', 'v1_0/apiuser/{clientId}/apikey'),
    ],

    'products' => [
        'collection' => [
            'id' => env('MOMO_COLLECTION_ID'),
            'callback_uri' => env('MOMO_COLLECTION_CALLBACK_URI'),
            'secret' => env('MOMO_COLLECTION_SECRET'),
            'key' => env('MOMO_COLLECTION_SUBSCRIPTION_KEY'),
            'party_id_type' => env('MOMO_COLLECTION_PARTY_ID_TYPE', 'msisdn'),
            'token_uri' => env('MOMO_COLLECTION_TOKEN_URI', 'collection/token/'),
            'transaction_uri' => env('MOMO_COLLECTION_TRANSACTION_URI', 'collection/v1_0/requesttopay'),
            'transaction_status_uri' => env(
                'MOMO_COLLECTION_TRANSACTION_STATUS_URI',
                'collection/v1_0/requesttopay/{momoTransactionId}'
            ),
            'account_balance_uri' => env('MOMO_COLLECTION_APP_BALANCE_URI', 'collection/v1_0/account/balance'),
            'account_status_uri' => env(
                'MOMO_COLLECTION_USER_ACCOUNT_URI',
                'collection/v1_0/accountholder/{partyIdType}/{partyId}/active'
            ),
            'account_holder_info_uri' => env(
                'MOMO_COLLECTION_USER_ACCOUNT_HOLDER_INFO_URI',
                'collection/v1_0/accountholder/msisdn/{partyId}/basicuserinfo'
            ),
        ],
        'disbursement' => [
            'id' => env('MOMO_DISBURSEMENT_ID'),

            'callback_uri' => env('MOMO_DISBURSEMENT_CALLBACK_URI'),

            'secret' => env('MOMO_DISBURSEMENT_SECRET'),

            'key' => env('MOMO_DISBURSEMENT_SUBSCRIPTION_KEY'),

            'party_id_type' => env('MOMO_DISBURSEMENT_PARTY_ID_TYPE', 'msisdn'),

            // Token uri
            'token_uri' => env('MOMO_DISBURSEMENT_TOKEN_URI', 'disbursement/token/'),

            // Transact (disburse)
            'transaction_uri' => env('MOMO_DISBURSEMENT_TRANSACTION_URI', 'disbursement/v1_0/transfer'),

            // Transaction status
            'transaction_status_uri' => env(
                'MOMO_DISBURSEMENT_TRANSACTION_STATUS_URI',
                'disbursement/v1_0/transfer/{momoTransactionId}'
            ),

            // Account balance
            'account_balance_uri' => env('MOMO_DISBURSEMENT_APP_BALANCE_URI', 'disbursement/v1_0/account/balance'),

            // Account status
            'account_status_uri' => env(
                'MOMO_DISBURSEMENT_USER_ACCOUNT_URI',
                'disbursement/v1_0/accountholder/{partyIdType}/{partyId}/active'
            ),

            // Account Holder Info
            'account_holder_info_uri' => env(
                'MOMO_DISBURSEMENT_USER_ACCOUNT_HOLDER_INFO_URI',
                'disbursement/v1_0/accountholder/msisdn/{partyId}/basicuserinfo'
            ),
        ],
        'remittance' => [
            'id' => env('MOMO_REMITTANCE_ID'),

            'callback_uri' => env('MOMO_REMITTANCE_CALLBACK_URI'),

            'secret' => env('MOMO_REMITTANCE_SECRET'),

            'key' => env('MOMO_REMITTANCE_SUBSCRIPTION_KEY'),

            'party_id_type' => env('MOMO_REMITTANCE_PARTY_ID_TYPE', 'msisdn'),

            // Token uri
            'token_uri' => env('MOMO_REMITTANCE_TOKEN_URI', 'remittance/token/'),

            // Transact (remit)
            'transaction_uri' => env('MOMO_REMITTANCE_TRANSACTION_URI', 'remittance/v1_0/transfer'),

            // Transaction status
            'transaction_status_uri' => env(
                'MOMO_REMITTANCE_TRANSACTION_STATUS_URI',
                'remittance/v1_0/transfer/{momoTransactionId}'
            ),

            // Account balance
            'account_balance_uri' => env('MOMO_REMITTANCE_APP_BALANCE_URI', 'remittance/v1_0/account/balance'),

            // Account status
            'account_status_uri' => env(
                'MOMO_REMITTANCE_USER_ACCOUNT_URI',
                'remittance/v1_0/accountholder/{partyIdType}/{partyId}/active'
            ),

            // Account Holder Info
            'account_holder_info_uri' => env(
                'MOMO_REMITTANCE_USER_ACCOUNT_HOLDER_INFO_URI',
                'remittance/v1_0/accountholder/msisdn/{partyId}/basicuserinfo'
            ),
        ],
    ],

    'guzzle' => [
        'options' => [
            // 'verify' => false,
        ],
    ],
];
