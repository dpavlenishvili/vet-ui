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
     *      example="01000000000"
     * )
     *
     * @var string
     */
    public $pid;

    /**
     * @OA\Property(
     *      title="First name",
     *      description="First name of the user",
     *      example="John"
     * )
     *
     * @var string
     */
    public $first_name;

    /**
     * @OA\Property(
     *      title="Last name",
     *      description="Last name of the user",
     *      example="Doe"
     * )
     *
     * @var string
     */
    public $last_name;

    /**
     * @OA\Property(
     *      title="Gender",
     *      description="gender of the user",
     *      example="Male"
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
     *      example="1999-12-31"
     * )
     *
     * @var string
     */
    public $birth_date;

    /**
     * @OA\Property(
     *      title="Residential",
     *      description="Residential of the user",
     *      example="GE"
     * )
     *
     * @var string
     */
    public $residential;

    /**
     * @OA\Property(
     *      title="Region",
     *      description="Region of the user",
     *      example="Tbilisi"
     * )
     *
     * @var string
     */
    public $region;

    /**
     * @OA\Property(
     *      title="City",
     *      description="City of the user",
     *      example="Tbilisi"
     * )
     *
     * @var string
     */
    public $city;

    /**
     * @OA\Property(
     *      title="Address",
     *      description="Address of the user",
     *      example="Robert Robertson, 1234"
     * )
     *
     * @var string
     */
    public $address;

    /**
     * @OA\Property(
     *      title="Alternative phone",
     *      description="Alternative phone of the user",
     *      example="555123456"
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
     *      example="example@example.com"
     * )
     *
     * @var string
     */
    public $email;
}