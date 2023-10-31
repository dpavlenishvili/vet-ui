<?php

namespace App\Http\Controllers\api\v1;

use App\Classes\SmsFacade;
use App\Http\Controllers\Controller;
use App\Http\Resources\UserResource;
use App\Models\Sms;
use App\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use OpenApi\Annotations as OA;

class AuthApiController extends Controller
{
    /**
     * Create a new AuthController instance.
     *
     * @return void
     */
    public function __construct()
    {
        $this->middleware('auth:api', ['except' => ['login', 'validateLogin', 'changePassword']]);
    }

    /**
     * @OA\Post(
     *      path="/auth/login",
     *      operationId="Login User",
     *      tags={"Auth"},
     *      summary="User authentication",
     *      @OA\RequestBody(
     *           required=true,
     *           @OA\JsonContent(
     *               @OA\Property(
     *                   type="string",
     *                   default="010000000000",
     *                   description="Personal ID",
     *                   property="pid"
     *               ),
     *               @OA\Property(
     *                   type="string",
     *                   default="password",
     *                   description="Password",
     *                   property="password"
     *               )
     *           )
     *       ),
     *       @OA\Response(
     *           response=200,
     *           description="Successful operation",
     *           @OA\JsonContent(
     *                @OA\Property(
     *                     type="string",
     *                     default="qwertyuio...",
     *                     description="Access token",
     *                     property="access_token"
     *                ),
     *                @OA\Property(
     *                    type="string",
     *                    default="bearer",
     *                    description="Token Type",
     *                    property="token_type"
     *                ),
     *                @OA\Property(
     *                    type="integer",
     *                    default="3600",
     *                    description="Token expiration time",
     *                    property="expires_in"
     *                )
     *           )
     *       ),
     *       @OA\Response(
     *           response=202,
     *           description="Successful operation but need 2fa code",
     *           @OA\JsonContent(
     *                @OA\Property(
     *                      type="boolean",
     *                      default="true",
     *                      description="Status",
     *                      property="status"
     *                 ),
     *                 @OA\Property(
     *                      type="string",
     *                      default="Waiting 2fa code",
     *                      description="Waiting 2fa code",
     *                      property="msg"
     *                  ),
     *                 @OA\Property(
     *                      type="string",
     *                      default="555****56",
     *                      description="Phone Mask",
     *                      property="phone_mask"
     *                  )
     *           )
     *       ),
     *      @OA\Response(
     *          response=401,
     *          description="Unauthenticated",
     *          @OA\JsonContent(
     *                @OA\Property(
     *                     type="boolean",
     *                     default="false",
     *                     description="Status",
     *                     property="status"
     *                ),
     *                @OA\Property(
     *                    type="string",
     *                    default="Invalid credentials",
     *                    description="Message",
     *                    property="msg"
     *                )
     *           )
     *      ),
     *       @OA\Response(
     *            response=406,
     *            description="Already accepted, 2fa code still active",
     *            @OA\JsonContent(
     *                  @OA\Property(
     *                       type="boolean",
     *                       default="false",
     *                       description="Status",
     *                       property="status"
     *                  ),
     *                  @OA\Property(
     *                      type="string",
     *                      default="Already accepted",
     *                      description="Message",
     *                      property="msg"
     *                  )
     *             )
     *        ),
     *       @OA\Response(
     *            response=500,
     *            description="Can't send message",
     *            @OA\JsonContent(
     *                  @OA\Property(
     *                       type="boolean",
     *                       default="false",
     *                       description="Status",
     *                       property="status"
     *                  ),
     *                  @OA\Property(
     *                      type="string",
     *                      default="Can't send 2fa Code",
     *                      description="Message",
     *                      property="msg"
     *                  )
     *             )
     *       )
     * )
     *
     * Get a JWT via given credentials.
     *
     * @return JsonResponse
     */
    public function login(): JsonResponse
    {
        $credentials = request(['pid', 'password']);

        if (! $token = auth()->attempt($credentials)) {
            return response()->json(['status' => false, 'msg' => 'Invalid credentials'], 401);
        }

        if (! auth()->user()->{'2fa'}) {
            return $this->respondWithToken($token);
        }

        $response = $this->generateAndSendSMSCode(auth()->user());

        if ($response == -1) {
            return response()->json(['status' => false, 'msg' => 'Already accepted'], 406);
        }

        if ($response == 0) {
            return response()->json(['status' => false, 'msg' => 'Can\'t send 2fa Code'], 500);
        }

        return response()->json([
            'status' => true,
            'msg' => 'Waiting 2fa code on: '.route('api.2fa.login'),
            'phone_mask' => maskPhoneNumber(auth()->user()->phone),
        ], 202);
    }

    /**
     * @OA\Post(
     *      path="/auth/login/2fa",
     *      operationId="Validate 2fa code",
     *      tags={"Auth"},
     *      summary="User authentication with 2fa code",
     *      @OA\RequestBody(
     *           required=true,
     *           @OA\JsonContent(
     *               @OA\Property(
     *                   type="string",
     *                   default="010000000000",
     *                   description="Personal ID",
     *                   property="pid"
     *               ),
     *                @OA\Property(
     *                    type="string",
     *                    default="password",
     *                    description="Password",
     *                    property="password"
     *                ),
     *                @OA\Property(
     *                    type="string",
     *                    default="1234",
     *                    description="2fa code",
     *                    property="code"
     *                )
     *           )
     *       ),
     *       @OA\Response(
     *           response=200,
     *           description="Successful operation",
     *           @OA\JsonContent(
     *                @OA\Property(
     *                     type="string",
     *                     default="qwertyuio...",
     *                     description="Access token",
     *                     property="access_token"
     *                ),
     *                @OA\Property(
     *                    type="string",
     *                    default="bearer",
     *                    description="Token Type",
     *                    property="token_type"
     *                ),
     *                @OA\Property(
     *                    type="integer",
     *                    default="3600",
     *                    description="Token expiration time",
     *                    property="expires_in"
     *                )
     *           )
     *       ),
     *       @OA\Response(
     *           response=401,
     *           description="Unauthenticated",
     *           @OA\JsonContent(
     *                 @OA\Property(
     *                      type="boolean",
     *                      default="false",
     *                      description="Status",
     *                      property="status"
     *                 ),
     *                 @OA\Property(
     *                     type="string",
     *                     default="Invalid credentials",
     *                     description="Message",
     *                     property="msg"
     *                 )
     *            )
     *       ),
     *
     *       @OA\Response(
     *           response=408,
     *           description="Time out to validate 2fa code",
     *           @OA\JsonContent(
     *                 @OA\Property(
     *                      type="boolean",
     *                      default="false",
     *                      description="Status",
     *                      property="status"
     *                 ),
     *                 @OA\Property(
     *                     type="string",
     *                     default="Time out to validate 2fa code",
     *                     description="Time out to validate 2fa code",
     *                     property="msg"
     *                 )
     *            )
     *       )
     * )
     *
     * Get a JWT via given credentials.
     *
     * @return JsonResponse
     */
    public function validateLogin(): JsonResponse
    {
        $credentials = request(['pid', 'password']);

        if (! $token = auth()->attempt($credentials)) {
            return response()->json(['status' => false, 'msg' => 'Invalid credentials'], 401);
        }

        if (auth()->user()->sms_code != request()->get('code')) {
            return response()->json(['status' => false, 'msg' => 'Invalid 2fa code'], 401);
        }

        $sms = Sms::where('phone', auth()->user()->phone)->where('created_at', '>', date('Y-m-d H:i:s', strtotime('-2 minutes')))->first();

        if (! $sms) {
            return response()->json(['status' => false, 'msg' => 'Time out to validate 2fa code'], 408);
        }

        return $this->respondWithToken($token);
    }

    /**
     * @OA\Get(
     *      path="/auth/me",
     *      operationId="Get user",
     *      tags={"Auth"},
     *      summary="Get user info",
     *      @OA\Parameter(
     *          name="Authorization",
     *          in="header",
     *          description="Bearer token",
     *          required=true,
     *          @OA\Schema(
     *              type="string"
     *          )
     *      ),
     *      @OA\Response(
     *           response=200,
     *           description="Successful operation",
     *           @OA\JsonContent(ref="#/components/schemas/UserRes")
     *        ),
     * )
     *
     * Get the authenticated User.
     *
     * @return JsonResponse
     */
    public function me(): UserResource
    {
        $user = auth()->user();

        return new UserResource($user);
    }

    /**
     * @OA\Delete(
     *      path="/auth/logout",
     *      operationId="Logout user",
     *      tags={"Auth"},
     *      summary="Logout user",
     *      @OA\Parameter(
     *          name="Authorization",
     *          in="header",
     *          description="Bearer token",
     *          required=true,
     *          @OA\Schema(
     *              type="string"
     *          )
     *      ),
     *      @OA\Response(
     *           response=200,
     *           description="Successful operation",
     *           @OA\JsonContent(
     *                  @OA\Property(
     *                       type="boolean",
     *                       default="true",
     *                       description="Status",
     *                       property="status"
     *                  ),
     *                  @OA\Property(
     *                      type="string",
     *                      default="Successfully logged out",
     *                      description="Successfully logged out",
     *                      property="msg"
     *                  )
     *             )
     *        ),
     * )
     *
     * Log the user out (Invalidate the token).
     *
     * @return JsonResponse
     */
    public function logout(): JsonResponse
    {
        auth()->logout();

        return response()->json(['status' => true, 'msg' => 'Successfully logged out']);
    }

    /**
     * @OA\Post(
     *      path="/auth/refresh",
     *      operationId="Refresh token",
     *      tags={"Auth"},
     *      summary="Refresh token",
     *      @OA\Parameter(
     *          name="Authorization",
     *          in="header",
     *          description="Bearer token",
     *          required=true,
     *          @OA\Schema(
     *              type="string"
     *          )
     *      ),
     *      @OA\Response(
     *           response=200,
     *           description="Successful operation",
     *           @OA\JsonContent(
     *                 @OA\Property(
     *                      type="string",
     *                      default="qwertyuio...",
     *                      description="Access token",
     *                      property="access_token"
     *                 ),
     *                 @OA\Property(
     *                     type="string",
     *                     default="bearer",
     *                     description="Token Type",
     *                     property="token_type"
     *                 ),
     *                 @OA\Property(
     *                     type="integer",
     *                     default="3600",
     *                     description="Token expiration time",
     *                     property="expires_in"
     *                 )
     *            )
     *        )
     * )
     *
     * Refresh token
     *
     * @return JsonResponse
     */
    public function refresh(): JsonResponse
    {
        return $this->respondWithToken(auth()->refresh());
    }

    /**
     * @OA\Post(
     *      path="/auth/password",
     *      operationId="Change password",
     *      tags={"Auth"},
     *      summary="Change password for user",
     *      @OA\RequestBody(
     *            required=true,
     *            @OA\JsonContent(
     *                @OA\Property(
     *                    type="string",
     *                    default="010000000000",
     *                    description="Personal ID",
     *                    property="pid"
     *                ),
     *                @OA\Property(
     *                    type="string",
     *                    default="password",
     *                    description="Password",
     *                    property="password"
     *                ),
     *                @OA\Property(
     *                    type="string",
     *                    default="password",
     *                    description="New Password",
     *                    property="new_password"
     *                ),
     *                @OA\Property(
     *                    type="string",
     *                    default="password",
     *                    description="Password confirmation",
     *                    property="password_confirmation"
     *                )
     *            )
     *       ),
     *      @OA\Response(
     *           response=200,
     *           description="Successful operation",
     *           @OA\JsonContent(
     *                 @OA\Property(
     *                       type="boolean",
     *                       default="true",
     *                       description="Status",
     *                       property="status"
     *                  ),
     *                  @OA\Property(
     *                      type="string",
     *                      default="Password updated",
     *                      description="Password updated",
     *                      property="msg"
     *                  )
     *            )
     *       ),
     *       @OA\Response(
     *           response=401,
     *           description="Unauthenticated",
     *           @OA\JsonContent(
     *                 @OA\Property(
     *                      type="boolean",
     *                      default="false",
     *                      description="Status",
     *                      property="status"
     *                 ),
     *                 @OA\Property(
     *                     type="string",
     *                     default="Invalid credentials",
     *                     description="Message",
     *                     property="msg"
     *                 )
     *            )
     *       ),
     *        @OA\Response(
     *             response=400,
     *             description="Password confirmation does not match",
     *             @OA\JsonContent(
     *                   @OA\Property(
     *                        type="boolean",
     *                        default="false",
     *                        description="Status",
     *                        property="status"
     *                   ),
     *                   @OA\Property(
     *                       type="string",
     *                       default="Password confirmation does not match",
     *                       description="Password confirmation does not match",
     *                       property="msg"
     *                   )
     *              )
     *         )
     *     )
     * )
     *
     * Change password
     *
     * @return JsonResponse
     */
    public function changePassword(): JsonResponse
    {
        if (! Auth::attempt(['pid' => request()->get('pid'), 'password' => request()->get('password')])) {
            return response()->json(['status' => false, 'msg' => 'Invalid credentials'], 401);
        }

        if (request()->get('new_password') !== request()->get('password_confirmation')) {
            return response()->json(['status' => false, 'msg' => 'Password confirmation does not match'], 400);
        }

        User::where('pid', request()->get('pid'))->update([
            'password' => Hash::make(request()->get('new_password')),
        ]);

        return response()->json(['status' => true, 'msg' => 'Password updated']);
    }

    /**
     * Get the token array structure.
     *
     * @param  string $token
     *
     * @return JsonResponse
     */
    protected function respondWithToken($token): JsonResponse
    {
        return response()->json([
            'access_token' => $token,
            'token_type' => 'bearer',
            'expires_in' => auth()->factory()->getTTL() * 60,
        ]);
    }

    private function generateAndSendSMSCode(User $user): int
    {
        $sms = Sms::where('phone', $user->phone)->where('created_at', '>', date('Y-m-d H:i:s', strtotime('-2 minutes')))->first();

        if ($sms) {
            return -1;
        }

        $code = random_int(1000, 9999);
        $user->sms_code = $code;
        $user->save();

        $request = (new SmsFacade())->set('phone', $user->phone)->set('text', 'SMS code: '.$code)->send();

        if (! $request) {
            return 0;
        }

        Sms::create([
            'phone' => $user->phone,
            'code' => $code,
            'created_at' => date('Y-m-d H:i:s'),
        ]);

        return 1;
    }
}
