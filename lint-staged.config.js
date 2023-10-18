module.exports = {
    'resources/**/*.{css,js}': ['prettier --write'],
    '**/*.php': ['php ./vendor/bin/php-cs-fixer fix --config php-cs-fixer --allow-risky=yes'],
    '**/*.{ts,js,json,md,html,css,scss}': [
        'nx affected --target lint --uncommitted --fix true',
        'nx affected --target test --uncommitted',
        'nx format:write --uncommitted',
    ],
};
