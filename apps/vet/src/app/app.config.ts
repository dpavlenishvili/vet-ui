import { provideHttpClient, withFetch, withInterceptors } from '@angular/common/http';
import type { ApplicationConfig } from '@angular/core';
import { provideClientHydration } from '@angular/platform-browser';
import { provideAnimations } from '@angular/platform-browser/animations';
import { provideRouter, withComponentInputBinding } from '@angular/router';
import { provideAngularSvgIcon } from 'angular-svg-icon';

import { dynamicPagesInitializer } from '@vet/dynamic-pages';
import {
  authenticationInterceptor,
  provideBaseApiUrl,
  provideBaseUrl,
  provideDefaultDateFallback,
  provideDefaultDateFormat,
  provideDefaultDateTimeFallback,
  provideDefaultDateTimeFormat,
  provideDefaultDisplayDateFormat,
  provideDefaultDisplayDateTimeFormat,
  provideEnvironment,
  provideKendoDatePickerFormat,
  provideKendoDateTimePickerFormat,
} from '@vet/shared';

import { environment } from '../environments/environment';

import { acceptLanguageInterceptor } from './accept-language.interceptor';
import { appRoutes } from './app.routes';
import { initializeTransolco } from '@vet/i18n';
import { provideAuthEnvironment } from '@vet/auth';
import { errorInterceptor } from '@vet/shared';

export const appConfig: ApplicationConfig = {
  providers: [
    provideAnimations(),
    provideRouter(appRoutes, withComponentInputBinding()),
    provideHttpClient(
      withFetch(),
      withInterceptors([acceptLanguageInterceptor, authenticationInterceptor, errorInterceptor]),
    ),
    provideEnvironment(environment),
    initializeTransolco(),
    provideAngularSvgIcon(),
    provideClientHydration(),
    provideBaseApiUrl(environment.apiBaseUrl),
    provideBaseUrl(environment.baseUrl),
    provideDefaultDateFormat(environment.defaultDateFormat),
    provideDefaultDateTimeFormat(environment.defaultDateTimeFormat),
    provideDefaultDisplayDateFormat(environment.defaultDisplayDateFormat),
    provideDefaultDisplayDateTimeFormat(environment.defaultDisplayDateTimeFormat),
    provideDefaultDateFallback(environment.defaultDateFallback),
    provideDefaultDateTimeFallback(environment.defaultDateTimeFallback),
    provideKendoDatePickerFormat(environment.kendoDatePickerFormat),
    provideKendoDateTimePickerFormat(environment.kendoDateTimePickerFormat),
    provideAuthEnvironment(environment.modules.auth),
    dynamicPagesInitializer(),
  ],
};
