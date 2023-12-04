<?php

namespace App\Virtual\Models;

use OpenApi\Annotations as OA;

/**
 * @OA\Schema(
 *     title="Page",
 *     description="Page model",
 *     @OA\Xml(
 *         name="Page"
 *     )
 * )
 */
class Page
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
     *      title="Type",
     *      description="Page type",
     *      example="default static page",
     *      type="string"
     * )
     *
     * @var string
     */
    public string $type;

    /**
     * @OA\Property(
     *      title="Collection ID",
     *      description="Attached collection",
     *      example="1",
     *      type="int"
     * )
     *
     * @var ['null', int]
     */
    public $collection_id;

    /**
     * @OA\Property(
     *      title="Title",
     *      description="Page title",
     *      example="Contact us",
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
     *      example="Contact us",
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
     *      title="Position",
     *      description="Page index for ordering purposes",
     *      example="1",
     *      type="int"
     * )
     *
     * @var int
     */
    public int $position;

    /**
     * @OA\Property(
     *      title="Parent ID",
     *      description="Parent page ID",
     *      example="1",
     *      type="int"
     * )
     *
     * @var int
     */
    public int $parent_id;

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
     *      title="Menus",
     *      description="Relations of menus",
     *      type="array",
     *      @OA\Items(
     *          @OA\Property(
     *               property="id",
     *               type="int",
     *               example="1"
     *           ),
     *           @OA\Property(
     *               property="name",
     *               type="string",
     *               example="Top menu"
     *           ),
     *      )
     * )
     *
     * @var array
     */
    public array $menus;

    /**
     * @OA\Property(
     *      title="Children",
     *      description="Children pages",
     *      type="array",
     *      property="children",
     *      @OA\Items(
     *          type="object",
     *      )
     * )
     *
     * @var array
     */
    public array $children;
}
