<?php

/*
 * This file is part of VET application.
 *
 * This is general configs of the VET application
 */

return [
    'languages' => ['ka', 'en'],
    'default_language' => 'ka',

    'page_types' => [
        'default_static' => 'Default static page',
        'collection' => 'Collection',
    ],

    'collection_types' => [
        'articles' => 'Articles',
    ],

    'permissions' => [
        'web' => [
            'User' => [
                'viewAny', 'view', 'update', 'create', 'delete', 'destroy',
            ],
            'Menu' => [
                'viewAny', 'view', 'update', 'create', 'delete', 'destroy',
            ],
            'Collection' => [
                'viewAny', 'view', 'update', 'create', 'delete', 'destroy',
            ],
            'CollectionsItems' => [
                'viewAny', 'view', 'update', 'create', 'delete', 'destroy',
            ],
            'Page' => [
                'viewAny', 'view', 'update', 'create', 'delete', 'destroy',
            ],
            'Role' => [
                'viewAny', 'view', 'update', 'create', 'delete', 'destroy',
            ],
            'Permission' => [
                'viewAny', 'view', 'update', 'create', 'delete', 'destroy',
            ],
        ],
        'api' => [
            'Application' => [
                'viewAny', 'view', 'apply',
            ],
        ],
    ],

    'guards' => [
        'api' => 'Site',
        'web' => 'Nova',
    ],
];
