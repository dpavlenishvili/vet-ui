<?php

namespace App\Http\Controllers\api\v1;

use App\Classes\Identity;
use App\Classes\SMS;
use App\Http\Controllers\Controller;
use App\Http\Requests\UserRequest;
use App\Http\Resources\UserResource;
use App\Models\User;
use App\Virtual\UserReq;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use OpenApi\Annotations as OA;
use Symfony\Component\HttpFoundation\Response;

class GeneralApiController extends Controller
{
    /**
     * @OA\Get(
     *      path="/general/countries",
     *      operationId="GetCountriesList",
     *      tags={"Generals"},
     *      summary="Get list of countries",
     *      description="Returns list of countries",
     *     @OA\Response(
     *           response=200,
     *           description="Successful operation",
     *           @OA\JsonContent(
     *                type="object",
     *                @OA\Property(
     *                      type="array",
     *                      property="data",
     *                      @OA\Items(
     *                           @OA\Property(
     *                              type="string",
     *                              default="GE",
     *                              description="Country code",
     *                              property="code"
     *                          ),
     *                          @OA\Property(
     *                              type="string",
     *                              default="Georgia",
     *                              description="Country Name",
     *                              property="name"
     *                          )
     *                      )
     *                 )
     *            )
     *       ),
     *  )
     */
    public function countries()
    {
        return ['data' => DB::table('countries')->addSelect('name', 'code')->get()];
    }
}
