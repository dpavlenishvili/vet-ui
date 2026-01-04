import { provideHttpClient, withFetch, withInterceptors } from '@angular/common/http';
import { ApplicationConfig, ErrorHandler, importProvidersFrom, inject, provideAppInitializer } from '@angular/core';
import { provideClientHydration } from '@angular/platform-browser';
import { provideAnimations } from '@angular/platform-browser/animations';
import { provideRouter, Router, withComponentInputBinding } from '@angular/router';
import { provideAngularSvgIcon } from 'angular-svg-icon';
import {
  provideBaseApiUrl,
  provideBaseUrl,
  provideDefaultDateFallback,
  provideDefaultDateFormat,
  provideDefaultDateTimeFallback,
  provideDefaultDateTimeFormat,
  provideDefaultDisplayDateFormat,
  provideDefaultDisplayDateSeparator,
  provideDefaultDisplayDateTimeFormat,
  provideEnvironment,
  provideKendoDatePickerFormat,
  provideKendoDateTimePickerFormat,
} from '@vet/shared/utils';
import { ToastModule } from '@vet/shared/ui-components';

import { environment } from '../environments/environment';
import * as Sentry from '@sentry/angular';

import { acceptLanguageInterceptor } from './accept-language.interceptor';
import { appRoutes } from './app.routes';
import { initializeTransolco } from '@vet/i18n';
import { authenticationInterceptor, provideAuthEnvironment, provideSso } from '@vet/auth';
import { NOTIFICATION_CONTAINER } from '@progress/kendo-angular-notification';
import { WA_WINDOW } from '@ng-web-apis/common';
import { provideKendoDateSettings } from './kendo-date-config.provider';
import { TranslocoService } from '@jsverse/transloco';
import { firstValueFrom, take } from 'rxjs';
import { provideFeatureFlags } from '@vet/feature-flags';

async function initTranslations() {
  const transloco = inject(TranslocoService);

  return await firstValueFrom(transloco.selectTranslation('en').pipe(take(1)));
}

export const appConfig: ApplicationConfig = {
  providers: [
    provideAnimations(),
    provideRouter(appRoutes, withComponentInputBinding()),
    provideHttpClient(withFetch(), withInterceptors([acceptLanguageInterceptor, authenticationInterceptor])),
    importProvidersFrom(ToastModule),
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
    provideDefaultDisplayDateSeparator(environment.defaultDisplayDateSeparator),
    provideDefaultDateFallback(environment.defaultDateFallback),
    provideDefaultDateTimeFallback(environment.defaultDateTimeFallback),
    provideKendoDatePickerFormat(environment.kendoDatePickerFormat),
    provideKendoDateTimePickerFormat(environment.kendoDateTimePickerFormat),
    provideAuthEnvironment(environment.modules.auth),
    provideSso(environment.modules.auth.keycloak),
    provideFeatureFlags(environment.featureFlags),
    provideKendoDateSettings(),
    provideAppInitializer(initTranslations),
    {
      provide: NOTIFICATION_CONTAINER,
      useFactory: () => {
        const _window = inject(WA_WINDOW);
        return { nativeElement: _window.document.body };
      },
    },
    {
      provide: ErrorHandler,
      useValue: Sentry.createErrorHandler(),
    },
    {
      provide: Sentry.TraceService,
      deps: [Router],
    },
    provideAppInitializer(() => {
      inject(Sentry.TraceService);
    }),
  ],
};
