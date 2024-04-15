<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Spatie\EloquentSortable\Sortable;
use Spatie\EloquentSortable\SortableTrait;
use Spatie\MediaLibrary\HasMedia;
use Spatie\MediaLibrary\InteractsWithMedia;
use Spatie\MediaLibrary\MediaCollections\Models\Media;

class Page extends Model implements Sortable, HasMedia
{
    use HasFactory;
    use SortableTrait;
    use InteractsWithMedia;

    public $sortable = [
        'order_column_name' => 'position',
        'sort_when_creating' => true,
    ];

    public function collection(): BelongsTo
    {
        return $this->belongsTo(Collection::class);
    }

    public function menus(): belongsToMany
    {
        return $this->belongsToMany(Menu::class, 'menu_pages', 'page_id', 'menu_id');
    }

    public function parent(): belongsTo
    {
        return $this->belongsTo(self::class, 'parent_id')->where('id', '!=', $this->id);
    }

    public function children(): HasMany
    {
        return $this->hasMany(self::class, 'parent_id')->orderBy('position')->with('children');
    }

    public static function getPagesTree(): array
    {
        $pages = self::where('status', true)->orderBy('position', 'asc')->with(['menus' => function ($query) {
            $query->select('menus.id', 'menus.name');
        }, 'media'])->get();

        return static::buildTree($pages);
    }

    protected static function buildTree($pages, int $parentId = null, string $slug = null): array
    {
        $tree = [];

        foreach ($pages as $page) {
            if ($page->parent_id == $parentId) {
                if ($slug) {
                    $page->slug = $slug.'/'.$page->slug;
                }

                $children = static::buildTree($pages, $page->id, $page->slug);

                if (count($children) > 0) {
                    $page->setAttribute('children', $children);
                }

                $tree[] = $page;
            }
        }

        return $tree;
    }

    public function registerMediaCollections(): void
    {
        $this->addMediaCollection('attachments');
    }
}
