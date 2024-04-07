<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class PageResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'slug' => $this->slug,
            'type' => $this->type,
            'collection_id' => $this->collection_id,
            'title' => $this->{'title_'.app()->getLocale()},
            'meta_title' => $this->{'meta_title_'.app()->getLocale()},
            'content' => $this->{'description_'.app()->getLocale()},
            'meta_description' => $this->{'meta_description_'.app()->getLocale()},
            'image' => $this->image,
            'position' => $this->position,
            'parent_id' => $this->parent_id,
            'created_at' => $this->created_at,
            'menus' => collect($this->menus)->map(function ($menu) {
                return [
                    'id' => $menu['id'],
                    'name' => $menu['name'],
                ];
            }),
            'children' => self::collection($this->children),
        ];
    }
}
