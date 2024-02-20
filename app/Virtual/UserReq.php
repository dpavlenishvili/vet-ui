<?php

namespace App\Virtual;

use OpenApi\Annotations as OA;

/**
 * @OA\Schema(
 *      title="User request",
 *      description="User request body data",
 *      type="object",
 *      required={"pid", "phone", "first_name", "last_name", "gender", "birth_date", "residential"}
 * )
 */
class UserReq
{
    /**
     * @OA\Property(
     *      title="Personal Id",
     *      description="Personal Id of project",
     *      example="01000000000",
     *      type="string"
     * )
     *
     * @var string
     */
    public string $pid;

    /**
     * @OA\Property(
     *      title="Phone",
     *      description="Phone number",
     *      example="555123456",
     *      type="string"
     * )
     *
     * @var string
     */
    public string $phone;

    /**
     * @OA\Property(
     *      title="First name",
     *      description="First name of the user",
     *      example="John",
     *      type="string"
     * )
     *
     * @var string
     */
    public string $first_name;

    /**
     * @OA\Property(
     *      title="Last name",
     *      description="Last name of the user",
     *      example="Doe",
     *      type="string"
     * )
     *
     * @var string
     */
    public string $last_name;

    /**
     * @OA\Property(
     *      title="Gender",
     *      description="gender of the user",
     *      example="male",
     *      oneOf={@OA\Schema(type="null"), @OA\Schema(type="string")}
     * )
     *
     * @var string
     */
    public string $gender;

    /**
     * @OA\Property(
     *      title="Birth date",
     *      description="Birth date of the user",
     *      format="date",
     *      example="1999-12-31",
     *      type="string"
     * )
     *
     * @var string
     */
    public string $birth_date;

    /**
     * @OA\Property(
     *      title="Residential",
     *      description="Residential of the user",
     *      example="GE",
     *      type="string"
     * )
     *
     * @var string
     */
    public string $residential;

    /**
     * @OA\Property(
     *      title="Region",
     *      description="Region of the user",
     *      example="Tbilisi",
     *      oneOf={@OA\Schema(type="null"), @OA\Schema(type="string")}
     * )
     *
     * @var string | null
     */
    public string $region;

    /**
     * @OA\Property(
     *      title="City",
     *      description="City of the user",
     *      example="Tbilisi",
     *      oneOf={@OA\Schema(type="null"), @OA\Schema(type="string")}
     * )
     *
     * @var string | null
     */
    public ?string $city;

    /**
     * @OA\Property(
     *      title="Address",
     *      description="Address of the user",
     *      example="Robert Robertson, 1234",
     *      oneOf={@OA\Schema(type="null"), @OA\Schema(type="string")}
     * )
     *
     * @var string | null
     */
    public ?string $address;

    /**
     * @OA\Property(
     *      title="Alternative phone",
     *      description="Alternative phone of the user",
     *      example="555123456",
     *      oneOf={@OA\Schema(type="null"), @OA\Schema(type="string")}
     * )
     *
     * @var string | null
     */
    public ?string $alt_phone;

    /**
     * @OA\Property(
     *      title="Email",
     *      description="Email of the user",
     *      format="email",
     *      example="example@example.com",
     *      oneOf={@OA\Schema(type="null"), @OA\Schema(type="string")}
     * )
     *
     * @var string | null
     */
    public ?string $email;

    /**
     * @OA\Property(
     *      title="Sms code",
     *      description="2fa code of the user",
     *      example="1234",
     *      oneOf={@OA\Schema(type="null"), @OA\Schema(type="string")}
     * )
     *
     * @var string | null
     */
    public ?string $sms_code;

    /**
     * @OA\Property(
     *      title="Password",
     *      description="Password of the user",
     *      example="password",
     *      oneOf={@OA\Schema(type="null"), @OA\Schema(type="string")}
     * )
     *
     * @var string
     */
    public $password;

    /**
     * @OA\Property(
     *      title="Password confirmation",
     *      description="Password confirmation",
     *      example="password",
     *      oneOf={@OA\Schema(type="null"), @OA\Schema(type="string")}
     * )
     *
     * @var string
     */
    public ?string $photo;

    /**
     * @OA\Property(
     *      title="Photo",
     *      description="Photo of the user",
     *      example="base64 string",
     *      oneOf={@OA\Schema(type="null"), @OA\Schema(type="string")}
     * )
     *
     * @var string
     */
    public $password_confirmation;
}
