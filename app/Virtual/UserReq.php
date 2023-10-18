<?php

namespace App\Virtual;

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
    public $pid;

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
    public $first_name;

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
    public $last_name;

    /**
     * @OA\Property(
     *      title="Gender",
     *      description="gender of the user",
     *      example="Male",
     *      type="[null, string]"
     * )
     *
     * @var string
     */
    public $gender;

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
    public $birth_date;

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
    public $residential;

    /**
     * @OA\Property(
     *      title="Region",
     *      description="Region of the user",
     *      example="Tbilisi",
     *      type="[null, string]"
     * )
     *
     * @var string
     */
    public $region;

    /**
     * @OA\Property(
     *      title="City",
     *      description="City of the user",
     *      example="Tbilisi",
     *      type="[null, string]"
     * )
     *
     * @var string
     */
    public $city;

    /**
     * @OA\Property(
     *      title="Address",
     *      description="Address of the user",
     *      example="Robert Robertson, 1234",
     *      type="[null, string]"
     * )
     *
     * @var string
     */
    public $address;

    /**
     * @OA\Property(
     *      title="Alternative phone",
     *      description="Alternative phone of the user",
     *      example="555123456",
     *      type="[null, string]"
     * )
     *
     * @var string
     */
    public $alt_phone;

    /**
     * @OA\Property(
     *      title="Email",
     *      description="Email of the user",
     *      format="email",
     *      example="example@example.com",
     *      type="[null, string]"
     * )
     *
     * @var string
     */
    public $email;

    /**
     * @OA\Property(
     *      title="Sms code",
     *      description="2fa code of the user",
     *      example="1234",
     *      type="[null, string]"
     * )
     *
     * @var string
     */
    public $sms_code;
}
