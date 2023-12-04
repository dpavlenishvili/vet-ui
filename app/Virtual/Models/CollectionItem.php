<?php

namespace App\Virtual\Models;

use OpenApi\Annotations as OA;

/**
 * @OA\Schema(
 *     title="Collection Item",
 *     description="Collection Item",
 *     @OA\Xml(
 *         name="Collection item",
 *     )
 * )
 */
class CollectionItem
{
    /**
     * @OA\Property(
     *     title="Slug",
     *     description="Slug",
     *     example="contact-us",
     *     type="string",
     * )
     *
     * @var string
     */
    public string $slug;

    /**
     * @OA\Property(
     *      title="Title",
     *      description="Item title",
     *      example="naxes ucxo moyme vinme",
     *      type="string"
     * )
     *
     * @var string
     */
    public string $title;

    /**
     * @OA\Property(
     *      title="Meta title",
     *      description="Page meta title",
     *      example="naxes ucxo moyme vinme",
     *      type="string"
     * )
     *
     * @var string
     */
    public string $meta_title;

    /**
     * @OA\Property(
     *      title="Content",
     *      description="Page content",
     *      example="<p>Hello world</p>",
     *     type="string"
     * )
     *
     * @var string
     */
    public string $content;

    /**
     * @OA\Property(
     *      title="Meta description",
     *      description="Page meta description",
     *      example="Hello world",
     *      type="string"
     * )
     *
     * @var string
     */
    public string $meta_description;

    /**
     * @OA\Property(
     *      title="Image",
     *      description="MPage main banner/poster",
     *      example="http://...",
     *      type="string"
     * )
     *
     * @var string
     */
    public string $image;

    /**
     * @OA\Property(
     *      title="Create at",
     *      description="Page creation date time",
     *      example="2024-12-30 13:00:00",
     *      type="string"
     * )
     *
     * @var string
     */
    public string $created_at;

    /**
     * @OA\Property(
     *      title="Pin",
     *      description="Pinned items",
     *      type="bool",
     *      property="pin",
     * )
     *
     * @var bool
     */
    public bool $pin;
}
