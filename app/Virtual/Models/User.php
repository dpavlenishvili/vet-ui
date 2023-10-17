<?php

namespace App\Virtual\Models;

/**
 * @OA\Schema(
 *     title="User",
 *     description="User model",
 *     @OA\Xml(
 *         name="User"
 *     )
 * )
 */
class User
{
    /**
     * @OA\Property(
     *     title="ID",
     *     description="ID",
     *     format="int32",
     *     example=1
     * )
     *
     * @var int
     */
    public $id;

    /**
     * @OA\Property(
     *      title="Personal ID",
     *      description="Personal ID of the user",
     *      example="01000000000"
     * )
     *
     * @var string
     */
    public $pid;

    /**
     * @OA\Property(
     *      title="Name",
     *      description="Fullname of the user",
     *      example="John Doe"
     * )
     *
     * @var string
     */
    public $name;

    /**
     * @OA\Property(
     *      title="First name",
     *      description="First name of the user",
     *      example="John"
     * )
     *
     * @var string
     */
    public $firstName;

    /**
     * @OA\Property(
     *      title="Last name",
     *      description="Last name of the user",
     *      example="Doe"
     * )
     *
     * @var string
     */
    public $lastName;

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
    public $birthDate;

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
    public $altPhone;

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

    /**
     * @OA\Property(
     *      title="Is active",
     *      description="Is active user",
     *      format="bool",
     *      example=true
     * )
     *
     * @var bool
     */
    public $isActive;

    /**
     * @OA\Property(
     *      title="Block reason",
     *      description="Block reason of user",
     *      example="Some reason"
     * )
     *
     * @var string
     */
    public $blockReason;

    /**
     * @OA\Property(
     *     title="Created at",
     *     description="Created at",
     *     example="2024-01-27 17:50:45",
     *     format="datetime",
     *     type="string"
     * )
     *
     * @var \DateTime
     */
    public $createdAt;

    /**
     * @OA\Property(
     *     title="Deleted at",
     *     description="Deleted at",
     *     example="2020-01-27 17:50:45",
     *     format="datetime",
     *     type="string"
     * )
     *
     * @var \DateTime
     */
    public $deletedAt;
}
