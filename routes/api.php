<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider and all of them will
| be assigned to the "api" middleware group. Make something great!
|
*/

Route::group([
    'prefix' => 'v1',
    'as' => 'api.',
    'namespace' => 'App\Http\Controllers\api\v1',
    'middleware' => ['api'],
], function () {
    Route::get('register/validate', 'UserApiController@validatePerson');
    Route::post('register', 'UserApiController@register');
    Route::get('sms/send', 'UserApiController@sendSms');
    Route::post('sms/validate', 'UserApiController@validatePhone');
    Route::get('general/countries', 'GeneralApiController@countries');

    Route::group(['middleware' => 'auth:api'], function () {
        Route::apiResource('users', 'UserApiController');
    });

    Route::group([
        'prefix' => 'auth',
    ], function ($router) {
        Route::post('login', 'AuthApiController@login')->name('login');
        Route::post('login/2fa', 'AuthApiController@validateLogin');
        Route::delete('logout', 'AuthApiController@logout');
        Route::post('refresh', 'AuthApiController@refresh');
        Route::get('me', 'AuthApiController@me');
    });
});
