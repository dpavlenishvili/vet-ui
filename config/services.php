<?php

return [

    /*
    |--------------------------------------------------------------------------
    | Third Party Services
    |--------------------------------------------------------------------------
    |
    | This file is for storing the credentials for third party services such
    | as Mailgun, Postmark, AWS and more. This file provides the de facto
    | location for this type of information, allowing packages to have
    | a conventional file to locate the various service credentials.
    |
    */

    'mailgun' => [
        'domain' => env('MAILGUN_DOMAIN'),
        'secret' => env('MAILGUN_SECRET'),
        'endpoint' => env('MAILGUN_ENDPOINT', 'api.mailgun.net'),
        'scheme' => 'https',
    ],

    'postmark' => [
        'token' => env('POSTMARK_TOKEN'),
    ],

    'ses' => [
        'key' => env('AWS_ACCESS_KEY_ID'),
        'secret' => env('AWS_SECRET_ACCESS_KEY'),
        'region' => env('AWS_DEFAULT_REGION', 'us-east-1'),
    ],

    'sms' => [
        'base_url' => env('SMS_BASE_URL'),
        'token' => env('SMS_TOKEN'),
    ],

    'identity_personal' => [
        'base_url' => env('IDENTITY_PERSONAL_BASE_URL', 'http://192.168.63.103/api/cra/person-info'),
        'id' => env('IDENTITY_PERSONAL_ID', '111'),
        'name' => env('IDENTITY_PERSONAL_APP_NAME', 'ChildrenChecker'),
        'key' => env('IDENTITY_PERSONAL_APP_KEY'),
    ],
];
