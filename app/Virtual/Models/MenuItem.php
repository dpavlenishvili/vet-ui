<?php

namespace App\Virtual\Models;

use OpenApi\Attributes as OAT;

#[OAT\Schema(required: ['id', 'name'])]
class MenuItem
{
    #[OAT\Property(example: '1')]
    public int $id;

    #[OAT\Property(example: 'Top menu')]
    public string $name;
}
