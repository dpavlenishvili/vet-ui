<?php

namespace App\Virtual\Res;

use OpenApi\Attributes as OAT;
use OpenApi\Generator;

#[\Attribute(\Attribute::TARGET_CLASS | \Attribute::TARGET_METHOD | \Attribute::IS_REPEATABLE)]
class DataResponse extends OAT\Response
{
    public function __construct(
        string|object|null $ref = null,
        string|int $response = null,
        ?string $description = null,
        ?array $headers = null,
        ?array $links = null,
        // annotation
        ?array $x = null,
        ?array $attachables = null
    ) {
        parent::__construct(
            response: $response,
            description: $description,
            headers: $headers,
            content: new OAT\JsonContent(
                properties: [
                    new OAt\Property(
                        property: 'data',
                        type: 'array',
                        items: new OAT\Items(
                            $ref
                        )
                    ),
                ]
            )
        );
    }
}
