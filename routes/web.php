<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
|
| Here is where you can register web routes for your application. These
| routes are loaded by the RouteServiceProvider and all of them will
| be assigned to the "web" middleware group. Make something great!
|
*/

Route::get('login', function () {
    echo 'login';
})->name('login');

Route::get('/{any}', function (Request $request) {
    $newDomain = env('FRONT_URL');
    $path = $request->path();
    $query = $request->query();

    $newUrl = $newDomain.'/'.$path;

    if (! empty($query)) {
        $newUrl .= '?'.http_build_query($query);
    }

    return redirect($newUrl);
})->where('any', '^(?!nova|api).*$');
