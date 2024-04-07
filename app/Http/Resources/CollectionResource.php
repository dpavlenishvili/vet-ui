<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class CollectionResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'slug' => $this->slug,
            'title' => $this->{'title_'.app()->getLocale()},
            'meta_title' => $this->{'meta_title_'.app()->getLocale()},
            'content' => $this->{'description_'.app()->getLocale()},
            'meta_description' => $this->{'meta_description_'.app()->getLocale()},
            'image' => $this->image,
            'keywords' => $this->keywords,
            'pin' => $this->pin,
            'created_at' => $this->created_at,
        ];
    }
}
