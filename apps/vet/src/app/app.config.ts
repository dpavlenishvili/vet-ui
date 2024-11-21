import { provideHttpClient, withFetch, withInterceptors } from '@angular/common/http';
import { ApplicationConfig } from '@angular/core';
import { provideClientHydration } from '@angular/platform-browser';
import { provideAnimations } from '@angular/platform-browser/animations';
import { provideRouter, withComponentInputBinding } from '@angular/router';
import { provideAngularSvgIcon } from 'angular-svg-icon';

import { dynamicPagesInitializer } from '@vet/dynamic-pages';
import { authenticationInterceptor, provideBaseApiUrl, provideBaseUrl } from '@vet/shared';

import { environment } from '../environments/environment';

import { acceptLanguageInterceptor } from './accept-language.interceptor';
import { appRoutes } from './app.routes';
import { initializeTransolco } from './initialize-transloco';

export const appConfig: ApplicationConfig = {
    providers: [
        provideAnimations(),
        provideRouter(appRoutes, withComponentInputBinding()),
        provideHttpClient(withFetch(), withInterceptors([acceptLanguageInterceptor, authenticationInterceptor])),
        initializeTransolco(),
        provideAngularSvgIcon(),
        provideClientHydration(),
        provideBaseApiUrl(environment.apiBaseUrl),
        provideBaseUrl(environment.baseUrl),
        dynamicPagesInitializer(),
    ],
};
