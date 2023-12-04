<?php

namespace App\Virtual\Res;

/**
 * @OA\Schema(
 *     title="collectionItemResource",
 *     description="Collection items resource",
 *     @OA\Xml(
 *         name="collectionItemsResource"
 *     )
 * )
 */
class CollectionItemsRes
{
    /**
     * @OA\Property(
     *     title="Data",
     *     description="Data wrapper"
     * )
     *
     * @var \App\Virtual\Models\CollectionItem[]
     */
    private $data;
}
