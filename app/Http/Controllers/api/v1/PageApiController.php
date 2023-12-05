<?php

namespace App\Http\Controllers\api\v1;

use App\Http\Controllers\Controller;
use App\Http\Resources\CollectionResource;
use App\Http\Resources\PageResource;
use App\Models\collection;
use App\Models\Menu;
use App\Models\Page;
use OpenApi\Annotations as OA;

class PageApiController extends Controller
{
    /**
     * @OA\Get(
     *      path="/pages",
     *      operationId="getPagesList",
     *      tags={"Pages"},
     *      summary="Get list of pages",
     *      description="Returns list of pages",
     *      @OA\Response(
     *          response=200,
     *          description="Successful operation",
     *          @OA\JsonContent(ref="#/components/schemas/PagesRes")
     *       )
     *  )
     */
    public function index()
    {
        return PageResource::collection(Page::getPagesTree());
    }

    /**
     * @OA\Get(
     *      path="/menus",
     *      operationId="menus",
     *      tags={"Pages"},
     *      summary="List of menus",
     *      description="Returns list of menus data",
     *      @OA\Response(
     *          response=200,
     *          description="Successful operation",
     *          @OA\Property(
     *              type="object",
     *              @OA\Property(
     *                  property="1",
     *                  type="string",
     *                  description="name of the menu",
     *                  property="name"
     *                  ),
     *          ),
     *      ),
     *  )
     */
    public function menus()
    {
        return response()->json(Menu::all()->pluck('name', 'id')->toArray());
    }

    /**
     * @OA\Get(
     *      path="/collection/{id}",
     *      operationId="Collections Items",
     *      tags={"Pages"},
     *      summary="Get collection items",
     *      description="Returns items of page colections",

     *      @OA\Parameter(
     *          name="id",
     *          description="Collection id",
     *          required=true,
     *          in="path",
     *          @OA\Schema(
     *              type="integer"
     *          )
     *      ),
     *      @OA\Response(
     *          response=200,
     *          description="Successful operation",
     *          @OA\JsonContent(ref="#/components/schemas/CollectionItemsRes")
     *       ),
     * )
     */
    public function collectionItem(collection $collection)
    {
        return CollectionResource::collection(
            $collection->collectionItem()
                ->where('status', true)
                ->orderBy('created_at', 'desc')
                ->get()
        );
    }
}
