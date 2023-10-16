<?php

namespace App\Http\Controllers;

use Illuminate\Foundation\Auth\Access\AuthorizesRequests;
use Illuminate\Foundation\Validation\ValidatesRequests;
use Illuminate\Routing\Controller as BaseController;

/**
 * @OA\Info(
 *      version="1.0.0",
 *      title="VET OpenApi Documentation",
 *      description="VET Swagger OpenApi",
 *      @OA\Contact(
 *          email="vsinauridze@emis.ge"
 *      )
 * )
 *
 * @OA\Server(
 *      url=L5_SWAGGER_CONST_HOST,
 *      description="VET API Server"
 * )

 *
 * @OA\Tag(
 *     name="VET",
 *     description="API Endpoints of Projects"
 * )
 */
class Controller extends BaseController
{
    use AuthorizesRequests, ValidatesRequests;
}
