import { ApplicationConfig, importProvidersFrom } from '@angular/core';
import { provideHttpClient, withFetch, withInterceptors } from '@angular/common/http';
import { provideRouter, withComponentInputBinding } from '@angular/router';
import { initializeTransolco } from './initialize-transloco';
import { provideAngularSvgIcon } from 'angular-svg-icon';
import { provideAnimations } from '@angular/platform-browser/animations';
import { provideDatepicker } from '@vet/ui/datepicker';
import { useBs5Theme } from './use-bs5-theme';
import { appRoutes } from './app.routes';
import { provideClientHydration } from '@angular/platform-browser';
import { provideBaseUrl } from '@vet/shared';
import { environment } from '../environments/environment';
import { ModalModule } from 'ngx-bootstrap/modal';
import { initAppPages } from '@vet/dynamic-pages';
import { acceptLanguageInterceptor } from './accept-language.interceptor';
import { authenticationInterceptor } from '@vet/authentication';

export const appConfig: ApplicationConfig = {
    providers: [
        provideAnimations(),
        provideRouter(appRoutes, withComponentInputBinding()),
        provideHttpClient(withFetch(), withInterceptors([acceptLanguageInterceptor, authenticationInterceptor])),
        initializeTransolco(),
        provideAngularSvgIcon(),
        useBs5Theme(),
        provideDatepicker(),
        provideClientHydration(),
        provideBaseUrl(environment.apiBaseUrl),
        importProvidersFrom(ModalModule.forRoot()),
        initAppPages,
    ],
};
