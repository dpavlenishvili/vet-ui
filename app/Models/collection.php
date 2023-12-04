<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class collection extends Model
{
    use HasFactory;

    public function page(): belongsTo
    {
        return $this->belongsTo(Page::class);
    }

    public function collectionItem(): hasMany
    {
        return $this->hasMany(CollectionItem::class);
    }
}
