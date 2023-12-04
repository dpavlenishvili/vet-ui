<?php

namespace App\Virtual\Res;

/**
 * @OA\Schema(
 *     title="pagesResource",
 *     description="Page resource",
 *     @OA\Xml(
 *         name="PageResource"
 *     )
 * )
 */
class PagesRes
{
    /**
     * @OA\Property(
     *     title="Data",
     *     description="Data wrapper"
     * )
     *
     * @var \App\Virtual\Models\Page[]
     */
    private $data;
}
