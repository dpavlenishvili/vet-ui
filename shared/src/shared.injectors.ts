import { inject, ValueProvider } from '@angular/core';

import { BASE_API_URL, BASE_URL } from './shared.tokens';

export function provideBaseApiUrl(url: string): ValueProvider {
    return {
        provide: BASE_API_URL,
        useValue: url,
    };
}

export function baseApiUrl(): string {
    return inject(BASE_API_URL);
}

export function provideBaseUrl(url: string): ValueProvider {
    return {
        provide: BASE_URL,
        useValue: url,
    };
}

export function baseUrl(): string {
    return inject(BASE_URL);
}
