<?php

namespace App\Http\Controllers\api\v1;

use App\Classes\Identity;
use App\Classes\SmsFacade;
use App\Http\Controllers\Controller;
use App\Http\Requests\UserRequest;
use App\Http\Resources\UserResource;
use App\Models\Sms;
use App\Models\User;
use App\Virtual\UserReq;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use OpenApi\Annotations as OA;
use Symfony\Component\HttpFoundation\Response;

class UserApiController extends Controller
{
    /**
     * @OA\Get(
     *      path="/users",
     *      operationId="getUserList",
     *      tags={"Users"},
     *      summary="Get list of users",
     *      description="Returns list of users",
     *      @OA\Parameter(
     *           name="Authorization",
     *           in="header",
     *           description="Bearer token",
     *           required=true,
     *           @OA\Schema(
     *               type="string"
     *           )
     *       ),
     *      @OA\Response(
     *          response=200,
     *          description="Successful operation",
     *          @OA\JsonContent(ref="#/components/schemas/UsersRes")
     *       ),
     *      @OA\Response(
     *          response=401,
     *          description="Unauthenticated",
     *      ),
     *      @OA\Response(
     *          response=403,
     *          description="Forbidden"
     *      )
     *     )
     */
    public function index()
    {
        $users = User::get();

        return UserResource::collection($users);
    }

    /**
     * @OA\Post(
     *      path="/users",
     *      operationId="storeUser",
     *      tags={"Users"},
     *      summary="Store new user",
     *      description="Returns user data",
     *      @OA\Parameter(
     *           name="Authorization",
     *           in="header",
     *           description="Bearer token",
     *           required=true,
     *           @OA\Schema(
     *               type="string"
     *           )
     *      ),
     *      @OA\RequestBody(
     *          required=true,
     *          @OA\JsonContent(ref="#/components/schemas/UserReq")
     *      ),
     *      @OA\Response(
     *          response=201,
     *          description="Successful operation",
     *          @OA\JsonContent(ref="#/components/schemas/UserRes")
     *       ),
     *      @OA\Response(
     *          response=400,
     *          description="Bad Request"
     *      ),
     *      @OA\Response(
     *          response=401,
     *          description="Unauthenticated",
     *      ),
     *      @OA\Response(
     *          response=403,
     *          description="Forbidden"
     *      )
     * )
     */
    public function store(UserRequest $request)
    {
        $user = User::create($request->all());

        return (new UserResource($user))
            ->response()
            ->setStatusCode(Response::HTTP_CREATED);
    }

    /**
     * @OA\Get(
     *      path="/users/{id}",
     *      operationId="getUserById",
     *      tags={"Users"},
     *      summary="Get user information",
     *      description="Returns user data",
     *      @OA\Parameter(
     *           name="Authorization",
     *           in="header",
     *           description="Bearer token",
     *           required=true,
     *           @OA\Schema(
     *               type="string"
     *           )
     *       ),
     *      @OA\Parameter(
     *          name="id",
     *          description="user id",
     *          required=true,
     *          in="path",
     *          @OA\Schema(
     *              type="integer"
     *          )
     *      ),
     *      @OA\Response(
     *          response=200,
     *          description="Successful operation",
     *          @OA\JsonContent(ref="#/components/schemas/UserRes")
     *       ),
     *      @OA\Response(
     *          response=400,
     *          description="Bad Request"
     *      ),
     *      @OA\Response(
     *          response=401,
     *          description="Unauthenticated",
     *      ),
     *      @OA\Response(
     *          response=403,
     *          description="Forbidden"
     *      )
     * )
     */
    public function show(User $user)
    {
        return new UserResource($user);
    }

    /**
     * @OA\Put(
     *      path="/users/{id}",
     *      operationId="updateUser",
     *      tags={"Users"},
     *      summary="Update existing user",
     *      description="Returns updated user data",
     *      @OA\Parameter(
     *           name="Authorization",
     *           in="header",
     *           description="Bearer token",
     *           required=true,
     *           @OA\Schema(
     *               type="string"
     *           )
     *      ),
     *      @OA\Parameter(
     *          name="id",
     *          description="user id",
     *          required=true,
     *          in="path",
     *          @OA\Schema(
     *              type="integer"
     *          )
     *      ),
     *      @OA\RequestBody(
     *          required=true,
     *          @OA\JsonContent(ref="#/components/schemas/UserReq")
     *      ),
     *      @OA\Response(
     *          response=202,
     *          description="Successful operation",
     *          @OA\JsonContent(ref="#/components/schemas/UserRes")
     *       ),
     *      @OA\Response(
     *          response=400,
     *          description="Bad Request"
     *      ),
     *      @OA\Response(
     *          response=401,
     *          description="Unauthenticated",
     *      ),
     *      @OA\Response(
     *          response=403,
     *          description="Forbidden"
     *      ),
     *      @OA\Response(
     *          response=404,
     *          description="Resource Not Found"
     *      )
     * )
     */
    public function update(UserRequest $request, User $user)
    {
        if (auth()->user()->id !== $user->id) {
            abort(404);
        }

        $user->update($request->all());

        return (new UserResource($user))
            ->response()
            ->setStatusCode(Response::HTTP_ACCEPTED);
    }

    /**
     * @OA\Delete(
     *      path="/users/{id}",
     *      operationId="deleteUser",
     *      tags={"Users"},
     *      summary="Delete existing user",
     *      description="Deletes a record and returns no content",
     *      @OA\Parameter(
     *           name="Authorization",
     *           in="header",
     *           description="Bearer token",
     *           required=true,
     *           @OA\Schema(
     *               type="string"
     *           )
     *      ),
     *      @OA\Parameter(
     *          name="id",
     *          description="User id",
     *          required=true,
     *          in="path",
     *          @OA\Schema(
     *              type="integer"
     *          )
     *      ),
     *      @OA\Response(
     *          response=204,
     *          description="Successful operation",
     *          @OA\JsonContent()
     *       ),
     *      @OA\Response(
     *          response=401,
     *          description="Unauthenticated",
     *      ),
     *      @OA\Response(
     *          response=403,
     *          description="Forbidden"
     *      ),
     *      @OA\Response(
     *          response=404,
     *          description="Resource Not Found"
     *      )
     * )
     */
    public function destroy(User $user)
    {
        $user->delete();

        return response(null, Response::HTTP_NO_CONTENT);
    }

    /**
     * @OA\Get(
     *      path="/register/validate",
     *      operationId="ValidatePerson",
     *      tags={"Register"},
     *      summary="Validate Person",
     *      description="Validate person by Personal Id and Last name",
     *      @OA\Parameter(
     *           name="pid",
     *           in="query",
     *           description="Personal ID",
     *           required=true,
     *           example="01000000000"
     *      ),
     *      @OA\Parameter(
     *           name="last_name",
     *           in="query",
     *           description="Last name",
     *           required=true,
     *           example="Doe"
     *      ),
     *      @OA\Response(
     *          response=200,
     *          description="Successful operation",
     *          @OA\JsonContent(
     *               type="object",
     *              @OA\Property(
     *                    type="string",
     *                    default="John",
     *                    description="First name",
     *                    property="firstName"
     *                ),
     *                @OA\Property(
     *                     type="string",
     *                     default="1999-12-31",
     *                     description="Birth date",
     *                     property="birthDate"
     *                ),
     *                @OA\Property(
     *                    type="string",
     *                    default="male",
     *                    description="Gender",
     *                    property="gender"
     *                ),
     *                @OA\Property(
     *                     type="string",
     *                     default="base64 string",
     *                     description="photo of user",
     *                     property="photo"
     *                )
     *           )
     *       ),
     *      @OA\Response(
     *          response=400,
     *          description="Bad Request",
     *          @OA\JsonContent(
     *                type="object",
     *                @OA\Property(
     *                    type="boolean",
     *                    default=false,
     *                    description="Person not validated",
     *                    property="status"
     *                )
     *            )
     *      ),
     *      @OA\Response(
     *          response=409,
     *          description="Conflict",
     *          @OA\JsonContent(
     *                type="object",
     *                @OA\Property(
     *                    type="boolean",
     *                    default=false,
     *                    description="Person already registered",
     *                    property="status"
     *                )
     *            )
     *      )
     * )
     */
    public function validatePerson()
    {
        $inputs = request()->all();
        $inputs['pid'] = $inputs['pid'] ?? $inputs['\pid'];

        if (User::where('pid', $inputs['pid'])->exists()) {
            return response()->json(['status' => false, 'error' => [
                'code' => 1009,
                'message' => __('error-codes.1009'),
            ]])->setStatusCode(409);
        }

        $request = (new Identity($inputs['pid'], $inputs['last_name']))->get();

        if (! $request || ! $request->json('firstName')) {
            return response()->json(['status' => false, 'error' => [
                'code' => 1008,
                'message' => __('error-codes.1008'),
            ]])->setStatusCode(400);
        }

        return [
            'firstName' => $request->json('firstName'),
            'birthDate' => date('Y-m-d', strtotime('+4 hours', $request->json('birthDate') / 1000)),
            'gender' => $request->json('gender') === 1 ? 'male' : 'female',
            'photo' => $request->json('photos.base64Binary.0'),
        ];
    }

    /**
     * @OA\Get(
     *      path="/sms/send",
     *      operationId="Send Sms code",
     *      tags={"SMS"},
     *      summary="Send one time code",
     *      description="Send one time code to validate phone number",
     *      @OA\Parameter(
     *           name="phone",
     *           in="query",
     *           description="Phone Number",
     *           required=true,
     *           example="555123456",
     *      ),
     *      @OA\Response(
     *          response=202,
     *          description="Successful operation",
     *          @OA\JsonContent(
     *               type="object",
     *               @OA\Property(
     *                   type="boolean",
     *                   default=true,
     *                   description="Send sms code",
     *                   property="status"
     *               )
     *           )
     *       ),
     *      @OA\Response(
     *          response=400,
     *          description="Bad Request",
     *          @OA\JsonContent(
     *                type="object",
     *                @OA\Property(
     *                    type="boolean",
     *                    default=false,
     *                    description="Sms send failed",
     *                    property="status"
     *                )
     *            )
     *      )
     * )
     */
    public function sendSms()
    {
        $sms = random_int(1000, 9999);
        $request = (new SmsFacade())->set('phone', request()->get('phone'))->set('text', 'SMS code: '.$sms)->send();

        Sms::where('phone', request()->get('phone'))->delete();

        Sms::create([
            'phone' => request()->get('phone'),
            'code' => $sms,
            'created_at' => date('Y-m-d H:i:s'),
        ]);

        return response()->json(['status' => $request])->setStatusCode($request === true ? 202 : 400);
    }

    /**
     * @OA\Post(
     *      path="/sms/validate",
     *      operationId="validate Sms",
     *      tags={"SMS"},
     *      summary="Validate SMS code",
     *      description="Validate SMS code",
     *      @OA\RequestBody(
     *           required=true,
     *           description="Validate SMS code",
     *           @OA\JsonContent(
     *                required={"phone", "sms_code"},
     *                @OA\Property(
     *                     type="string",
     *                     default="555123456",
     *                     description="Phone number",
     *                     property="phone",
     *                 ),
     *                 @OA\Property(
     *                     type="string",
     *                     default="1234",
     *                     description="SMS code",
     *                     property="sms_code",
     *                 )
     *           )
     *      ),
     *      @OA\Response(
     *          response=200,
     *          description="Successful operation",
     *          @OA\JsonContent(
     *               type="object",
     *               @OA\Property(
     *                    type="boolean",
     *                    default=true,
     *                    description="Send sms code",
     *                    property="status"
     *                )
     *           )
     *       ),
     *      @OA\Response(
     *          response=400,
     *          description="Bad Request",
     *          @OA\JsonContent(
     *                type="object",
     *                @OA\Property(
     *                     type="boolean",
     *                     default=false,
     *                     description="SMS code not valid",
     *                     property="status"
     *                 )
     *            )
     *      )
     * )
     */
    public function validatePhone(Request $request)
    {
        $sms = Sms::where('phone', $request->get('phone'))->where('code', $request->get('sms_code'))->first();

        if (! $sms) {
            return response()->json(['status' => false, 'error' => [
                'code' => 1004,
                'message' => __('error-codes.1004'),
            ]])->setStatusCode(400);
        }

        if (strtotime($sms->created_at) < strtotime('-2 minutes')) {
            return response()->json(['status' => false, 'msg' => 'SMS code is expired', 'error' => [
                'code' => 1005,
                'message' => __('error-codes.1005'),
            ]], 408);
        }

        return response()->json(['status' => true])->setStatusCode(200);
    }

    /**
     * @OA\Post(
     *      path="/register",
     *      operationId="Register",
     *      tags={"Register"},
     *      summary="Register user",
     *      description="Returns user data",
     *      @OA\RequestBody(
     *          required=true,
     *          @OA\JsonContent(ref="#/components/schemas/UserReq")
     *      ),
     *      @OA\Response(
     *          response=201,
     *          description="Successful operation",
     *          @OA\JsonContent(ref="#/components/schemas/UserRes")
     *       ),
     *      @OA\Response(
     *          response=400,
     *          description="2fa code not valid",
     *          @OA\JsonContent(
     *               type="object",
     *               @OA\Property(
     *                     type="boolean",
     *                     default=false,
     *                     description="2fa code not valid",
     *                     property="status"
     *                ),
     *                @OA\Property(
     *                     type="string",
     *                     default="2fa code not valid",
     *                     description="2fa code not valid",
     *                     property="msg"
     *                )
     *           )
     *      ),
     *      @OA\Response(
     *          response=401,
     *          description="Unauthenticated",
     *      ),
     *      @OA\Response(
     *          response=403,
     *          description="Forbidden"
     *      )
     * )
     */
    public function register(UserRequest $request)
    {
        $sms = Sms::where('phone', $request->get('phone'))->where('code', $request->get('sms_code'))->first();

        if (! $sms) {
            return response()->json(['status' => false, 'msg' => '2fa code not valid', 'error' => [
                'code' => 1004,
                'message' => __('error-codes.1004'),
            ]])->setStatusCode(400);
        }

        $inputs = $request->all();
        $inputs['password'] = Hash::make($inputs['password']);
        $user = new User();
        $user->fill($inputs);
        $user->save();

        if ($sms) {
            $sms->delete();
        }

        return (new UserResource($user))
            ->response()
            ->setStatusCode(Response::HTTP_CREATED);
    }
}
