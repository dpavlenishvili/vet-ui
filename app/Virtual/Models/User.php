<?php

namespace App\Virtual\Models;

use OpenApi\Annotations as OA;

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
     *     example=1,
     *     type="integer",
     * )
     *
     * @var int
     */
    public int $id;

    /**
     * @OA\Property(
     *      title="Personal ID",
     *      description="Personal ID of the user",
     *      example="01000000000",
     *      type="string"
     * )
     *
     * @var string
     */
    public string $pid;

    /**
     * @OA\Property(
     *      title="Name",
     *      description="Fullname of the user",
     *      example="John Doe",
     *      type="string"
     * )
     *
     * @var string
     */
    public string $name;

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
    public string $firstName;

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
    public string $lastName;

    /**
     * @OA\Property(
     *      title="Gender",
     *      description="gender of the user",
     *      example="Male",
     *     type="string"
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
    public string $birthDate;

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
    public ?string $region;

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
    public ?string $altPhone;

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
     *      title="Photo",
     *      description="Photo of the user",
     *      example="/users/photos/qwertyuio.jpg",
     *      oneOf={@OA\Schema(type="null"), @OA\Schema(type="string")}
     * )
     *
     * @var string | null
     */
    public string $photo;

    /**
     * @OA\Property(
     *      title="Is active",
     *      description="Is active user",
     *      format="bool",
     *      example=false,
     *      type="boolean",
     * )
     *
     * @var bool
     */
    public bool $isActive;

    /**
     * @OA\Property(
     *      title="Block reason",
     *      description="Block reason of user",
     *      example="Some reason",
     *      oneOf={@OA\Schema(type="null"), @OA\Schema(type="string")}
     * )
     *
     * @var string | null
     */
    public ?string $blockReason;

    /**
     * @OA\Property(
     *     title="Created at",
     *     description="Created at",
     *     example="2024-01-27 17:50:45",
     *     format="datetime",
     *     type="string"
     * )
     *
     * @var string
     */
    public string $created_at;

    /**
     * @OA\Property(
     *     title="Deleted at",
     *     description="Deleted at",
     *     example="null",
     *     format="datetime",
     *     oneOf={@OA\Schema(type="null"), @OA\Schema(type="string")}
     * )
     *
     * @var string | null
     */
    public ?string $deletedAt;
}
