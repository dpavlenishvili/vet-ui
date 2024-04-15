<?php

namespace App\Virtual\Models;

use OpenApi\Attributes as OAT;

#[OAT\Schema(required: ['id', 'name'])]
class MediaItem
{
    #[OAT\Property(example: '/uploads/1/sample-Document.pdf",')]
    public string $url;

    #[OAT\Property(example: 'Sample Document.pdf')]
    public string $name;

    #[OAT\Property(example: 'application/pdf')]
    public string $mime_type;

    #[OAT\Property(example: '1000')]
    public int $size;

    #[OAT\Property(example: '1')]
    public int $order_column;
}
