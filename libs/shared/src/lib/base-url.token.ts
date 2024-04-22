import { inject, InjectionToken, ValueProvider } from '@angular/core';

export const BASE_URL = new InjectionToken<string>('Api base URL.');

export function provideBaseUrl(url: string): ValueProvider {
    return {
        provide: BASE_URL,
        useValue: url,
    };
}

export function baseUrl(): string {
    return inject(BASE_URL);
}
