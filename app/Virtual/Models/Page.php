<?php

namespace App\Virtual\Models;

use OpenApi\Attributes as OAT;

#[OAT\Schema]
class Page
{
    /**
     * @var string
     */
    #[OAT\Property]
    public string $slug;

    #[OAT\Property]
    #[OAT\Examples('default | static | page', summary: 'Page type')]
    public string $type;

    /**
     * Attached collection
     */
    #[OAT\Property]
    public int $collection_id;

    /**
     * Page title
     * @example Contact us
     */
    #[OAT\Property]
    public string $title;

    /**
     * Page meta title
     * @example Contact us
     */
    #[OAT\Property]
    public string $meta_title;

    #[OAT\Property]
    public string $content;

    /**
     * Page meta description
     */
    #[OAT\Property]
    public string $meta_description;

    /**
     * MPage main banner/poster
     */
    #[OAT\Property]
    public string $image;

    /**
     * Page index for ordering purposes
     */
    #[OAT\Property]
    public int $position;

    /**
     * Parent page ID
     */
    #[OAT\Property]
    public int $parent_id;

    /**
     * Page creation date time
     */
    #[OAT\Property]
    #[OAT\Examples('2024-12-30 13:00:00', summary: 'Page creation date time')]
    public string $created_at;

    /**
     * @var MenuItem[]
     */
    #[OAt\Property(
        title: 'Menus',
        description: 'Relations of menus'
    )]
    public array $menus;

    /**
     * @var Page[]
     */
    #[OAT\Property]
    public array $children;
}
