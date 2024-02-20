<?php

namespace App\Http\Controllers\api\v1;

use App\Classes\EvetFacade;
use App\Classes\KeyCloack;
use App\Classes\SmsFacade;
use App\Http\Controllers\Controller;
use App\Http\Resources\UserResource;
use App\Models\Sms;
use App\Models\User;
use App\Virtual\Req\LoginRequestBody;
use App\Virtual\Res\UserLogin2FaResponseBody;
use App\Virtual\Res\UserLoginResponseBody;
use Illuminate\Foundation\Auth\AuthenticatesUsers;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Validator;
use Illuminate\Validation\Rules\Password;
use OpenApi\Annotations as OA;
use OpenApi\Attributes as OAT;
use Tymon\JWTAuth\Facades\JWTAuth;

class AuthApiController extends Controller
{
    use AuthenticatesUsers;

    protected int $maxAttempts = 3;

    protected int $decayMinutes = 5;

    /**
     * Create a new AuthController instance.
     *
     * @return void
     */
    public function __construct()
    {
        $this->middleware('auth:api', ['except' => [
            'login',
            'validateLogin',
            'changePassword',
            'initForgetPassword',
            'resetPassword',
        ]]);
    }

    #[OAT\Post(
        path: '/auth/login',
        operationId: 'Login User',
        summary: 'User authentication',
        requestBody: new OAT\RequestBody(
            required: true,
            content: new OAT\JsonContent(
                ref: LoginRequestBody::class,
            ),
        ),
        tags: ['Auth']
    )]
    #[OAT\Response(
        response: 200,
        description: 'Successful operation',
        content: new OAT\JsonContent(
            ref: UserLoginResponseBody::class,
        )
    )]
    #[OAT\Response(
        response: 202,
        description: 'Successful operation but need 2fa code',
        content: new OAT\JsonContent(
            ref: UserLogin2FaResponseBody::class,
        ),
    )]
    #[OAT\Response(
        response: 401,
        description: 'Unauthenticated',
        content: new OAT\JsonContent(
            properties: [
                new OAT\Property(property: 'status', description: 'Status', type: 'boolean', default: 'false'),
                new OAT\Property(property: 'msg', description: 'Invalid credentials', type: 'string', default: 'Invalid credentials'),
            ],
        ),
    )]
    #[OAT\Response(
        response: 406,
        description: 'Already accepted, 2fa code still active',
        content: new OAT\JsonContent(
            properties: [
                new OAT\Property(property: 'status', description: 'Status', type: 'boolean', default: 'false'),
                new OAT\Property(property: 'msg', description: 'Already accepted', type: 'string', default: 'Already accepted'),
            ],
        ),
    )]
    #[OAT\Response(
        response: 500,
        description: "Can't send message",
        content: new OAT\JsonContent(
            properties: [
                new OAT\Property(property: 'status', description: 'Status', type: 'boolean', default: 'false'),
                new OAT\Property(property: 'msg', description: "Can't send 2fa Code", type: 'string', default: "Can't send 2fa Code"),
            ],
        ),
    )]
    public function login(): JsonResponse
    {
        if ($this->hasTooManyLoginAttempts(request())) {
            return response()->json(['status' => false, 'msg' => 'Too many attempt', 'error' => [
                'code' => 1010,
                'message' => __('error-codes.1010'),
                'block_expire_in' => $this->limiter()->availableIn($this->throttleKey(request())),
            ]], 401);
        }

        $credentials = request(['pid', 'password']);
        $token = auth()->attempt($credentials);
        $user = null;

        if (! $token) {
            [$token, $user] = $this->attempLoginByAd($credentials);
        } else {
            $user = auth()->user();
        }

        if (! $token || ! $user) {
            $this->incrementLoginAttempts(request());

            return response()->json(['status' => false, 'msg' => 'Invalid credentials', 'error' => [
                'code' => 1001,
                'message' => __('error-codes.1001'),
            ]], 401);
        }
        if (! $user->{'2fa'}) {
            return $this->respondWithToken($token);
        }

        $response = $this->generateAndSendSMSCode($user);

        if ($response == -1) {
            return response()->json(['status' => false, 'msg' => 'Already accepted', 'error' => [
                'code' => 1002,
                'message' => __('error-codes.1002'),
            ]], 406);
        }

        if ($response == 0) {
            return response()->json(['status' => false, 'msg' => 'Can\'t send 2fa Code', 'error' => [
                'code' => 1003,
                'message' => __('error-codes.1003'),
            ]], 500);
        }

        return response()->json([
            'status' => true,
            'msg' => 'Waiting 2fa code on: '.route('api.2fa.login'),
            'phone_mask' => strMask($user->phone, 3, -2),
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
            return response()->json(['status' => false, 'msg' => 'Invalid credentials', 'error' => [
                'code' => 1001,
                'message' => __('error-codes.1001'),
            ]], 401);
        }

        if (auth()->user()->sms_code != request()->get('code')) {
            return response()->json(['status' => false, 'msg' => 'Invalid 2fa code', 'error' => [
                'code' => 1004,
                'message' => __('error-codes.1004'),
            ]], 401);
        }

        $sms = Sms::where('phone', auth()->user()->phone)->where('created_at', '>', date('Y-m-d H:i:s', strtotime('-2 minutes')))->first();

        if (! $sms) {
            return response()->json(['status' => false, 'msg' => 'Time out to validate 2fa code', 'error' => [
                'code' => 1005,
                'message' => __('error-codes.1005'),
            ]], 408);
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
            return response()->json(['status' => false, 'msg' => 'Invalid credentials', 'error' => [
                'code' => 1001,
                'message' => __('error-codes.1001'),
            ]], 401);
        }

        if (request()->get('new_password') !== request()->get('password_confirmation')) {
            return response()->json(['status' => false, 'msg' => 'Password confirmation does not match', 'error' => [
                'code' => 1006,
                'message' => __('error-codes.1006'),
            ]], 400);
        }

        $validator = Validator::make(request()->only('password'), [
            'password' => [
                'required',
                Password::min(8)
                    ->letters()
                    ->mixedCase()
                    ->numbers()
                    ->symbols(),
            ],
        ]);

        if ($validator->fails()) {
            return response()->json(['status' => false, 'msg' => 'Invalid password', 'errors' => $validator->errors()], 400);
        }

        User::where('pid', request()->get('pid'))->update([
            'password' => Hash::make(request()->get('new_password')),
        ]);

        return response()->json(['status' => true, 'msg' => 'Password updated']);
    }

    /**
     * @OA\Post(
     *      path="/auth/reset",
     *      operationId="Init forget password",
     *      tags={"Auth"},
     *      summary="Init forget password for user",
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
     *                    default="555123456",
     *                    description="Phone Number",
     *                    property="phone"
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
     *                      description="Sms code sent",
     *                      property="msg"
     *                  ),
     *            )
     *       ),
     *       @OA\Response(
     *           response=400,
     *           description="Invalid credentials",
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
     *         )
     *     )
     * )
     *
     * Init forget password
     *
     * @return JsonResponse
     */
    public function initForgetPassword(): JsonResponse
    {
        $user = User::where('pid', request()->get('pid'))->where('phone', request()->get('phone'))->first();

        if (! $user) {
            return response()->json(['status' => false, 'msg' => 'Invalid credentials', 'error' => [
                'code' => 1007,
                'message' => __('error-codes.1007'),
            ]], 400);
        }

        $smsCode = mt_rand(1000, 9999);
        (new SmsFacade())->set('phone', $user->phone)->set('text', sprintf(
            'momxmareblis sakheli: %s, verifikaciis ertjeradi kodi: %s',
            strMask($user->pid, 3, -2),
            $smsCode,
        ))->send();

        Sms::create([
            'phone' => $user->phone,
            'code' => $smsCode,
        ]);

        return response()->json(['status' => true, 'msg' => 'Sms code sent']);
    }

    /**
     * @OA\Post(
     *      path="/auth/reset/save",
     *      operationId="Reset password",
     *      tags={"Auth"},
     *      summary="Reset password for user",
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
     *                    default="555123456",
     *                    description="Phone Number",
     *                    property="phone"
     *                ),
     *                @OA\Property(
     *                     type="string",
     *                     default="1234",
     *                     description="Sms code",
     *                     property="code"
     *                 ),
     *                 @OA\Property(
     *                     type="string",
     *                     default="password",
     *                     description="New Password",
     *                     property="password"
     *                 )
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
     *                      property="msg",
     *                  ),
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
     *              )
     *         ),
     *         @OA\Response(
     *           response=408,
     *           description="Invalid SMS code or expired",
     *           @OA\JsonContent(
     *                 @OA\Property(
     *                      type="boolean",
     *                      default="false",
     *                      description="Status",
     *                      property="status"
     *                 ),
     *                 @OA\Property(
     *                     type="string",
     *                     default="Invalid Sms code",
     *                     description="Message",
     *                     property="msg"
     *                 )
     *              )
     *         ),
     *         @OA\Response(
     *           response=400,
     *           description="Invalid password",
     *           @OA\JsonContent(
     *                 @OA\Property(
     *                      type="boolean",
     *                      default="false",
     *                      description="Status",
     *                      property="status"
     *                 ),
     *                 @OA\Property(
     *                     type="string",
     *                     default="Invalid password",
     *                     description="Message",
     *                     property="msg"
     *                 ),
     *                 @OA\Property(
     *                      type="array",
     *                      default="[...]",
     *                      description="Validation Error",
     *                      property="errors",
     *                      @OA\Items(
     *                           @OA\Property(
     *                              property="password",
     *                              type="string",
     *                              example="..."
     *                           ),
     *                       )
     *                  )
     *              )
     *          )
     *      )
     * )
     *
     * Reset password
     *
     * @return JsonResponse
     */
    public function resetPassword(): JsonResponse
    {
        $user = User::where('pid', request()->get('pid'))->where('phone', request()->get('phone'))->first();

        if (! $user) {
            return response()->json(['status' => false, 'msg' => 'Invalid credentials', 'error' => [
                'code' => 1007,
                'message' => __('error-codes.1007'),
            ]], 401);
        }

        $sms = Sms::where('phone', $user->phone)
            ->where('code', request()->get('code'))
            ->first();

        if (! $sms) {
            return response()->json(['status' => false, 'msg' => 'Invalid SMS code', 'error' => [
                'code' => 1004,
                'message' => __('error-codes.1004'),
            ]], 400);
        }

        if (strtotime($sms->created_at) < strtotime('-2 minutes')) {
            return response()->json(['status' => false, 'msg' => 'SMS code is expired', 'error' => [
                'code' => 1005,
                'message' => __('error-codes.1005'),
            ]], 408);
        }

        $validator = Validator::make(request()->only('password'), [
            'password' => [
                'required',
                Password::min(8)
                    ->letters()
                    ->mixedCase()
                    ->numbers()
                    ->symbols(),
            ],
        ]);

        if ($validator->fails()) {
            return response()->json(['status' => false, 'msg' => 'Invalid password', 'errors' => $validator->errors()], 400);
        }

        $user->password = Hash::make(request()->get('password'));
        $user->save();

        return response()->json(['status' => true, 'msg' => 'Password updated']);
    }

    /**
     * Get the token array structure.
     *
     * @param string $token
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

    private function attempLoginByAd(array $credentials): ?array
    {
        $response = (new KeyCloack($credentials['pid'], $credentials['password']))->auth();

        if (! $response) {
            return null;
        }

        $adUser = $response->userInfo();

        $userData = (new EvetFacade($adUser['person_id']))->get();

        if (! $userData) {
            return null;
        }

        $user = User::updateOrCreate(
            [
                'pid' => $adUser['person_id'],
            ],
            [
                'first_name' => $userData['firstName'],
                'last_name' => $userData['lastName'],
                'name' => $userData['firstName'].' '.$userData['lastName'],
                'gender' => $userData['gender'] === 'მდედრობითი' ? 'female' : 'male',
                'birth_date' => $userData['birthDate'],
                'phone' => $userData['mobile'],
                'residential' => 'GE',
                'password' => 'null',
                '2fa' => true,
            ]
        );

        return [JWTAuth::fromUser($user), $user];
    }
}
