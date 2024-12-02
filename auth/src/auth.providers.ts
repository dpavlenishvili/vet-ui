import { Provider } from '@angular/core';
import { AuthEnvironment } from './auth.types';
import { AUTH_ENVIRONMENT } from './auth.tokens';

export function provideAuthEnvironment(environment: AuthEnvironment): Provider {
    return {
        provide: AUTH_ENVIRONMENT,
        useValue: environment,
    };
}
