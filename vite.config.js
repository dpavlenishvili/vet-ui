import { defineConfig } from 'vite';
import laravel from 'laravel-vite-plugin';

export default defineConfig({
    plugins: [
        laravel({
            input: [
                'public/core/main.js',
                'public/core/styles.css',
                'public/core/polyfills.js',
                'public/core/runtime.js',
            ],
            refresh: true,
        }),
    ],
    resolve: {
        alias: {
            '@': 'frontend/src/app',
        },
    },
});
