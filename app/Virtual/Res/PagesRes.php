<?php

namespace App\Virtual\Res;

use App\Virtual\Models\Page;
use OpenApi\Attributes as OAT;

/**
 * Page Resource
 */
#[OAT\Schema]
class PagesRes
{
    /**
     * @var Page[]
     */
    #[OAT\Property]
    private array $data;
}
