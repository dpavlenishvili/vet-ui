import { provideHttpClient, withFetch, withInterceptors } from '@angular/common/http';
import { ApplicationConfig, importProvidersFrom, inject, provideAppInitializer } from '@angular/core';
import { provideClientHydration } from '@angular/platform-browser';
import { provideAnimations } from '@angular/platform-browser/animations';
import { provideRouter, withComponentInputBinding } from '@angular/router';
import { provideAngularSvgIcon } from 'angular-svg-icon';

import { dynamicPagesInitializer } from '@vet/dynamic-pages';
import {
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
  ToastModule,
} from '@vet/shared';

import { environment } from '../environments/environment';

import { acceptLanguageInterceptor } from './accept-language.interceptor';
import { appRoutes } from './app.routes';
import { initializeTransolco } from '@vet/i18n';
import { authenticationInterceptor, provideAuthEnvironment } from '@vet/auth';
import { NOTIFICATION_CONTAINER } from '@progress/kendo-angular-notification';
import { WA_WINDOW } from '@ng-web-apis/common';
import { provideKendoDateSettings } from './kendo-date-config.provider';
import { TranslocoService } from '@jsverse/transloco';
import { firstValueFrom, take } from 'rxjs';

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
    provideDefaultDateFallback(environment.defaultDateFallback),
    provideDefaultDateTimeFallback(environment.defaultDateTimeFallback),
    provideKendoDatePickerFormat(environment.kendoDatePickerFormat),
    provideKendoDateTimePickerFormat(environment.kendoDateTimePickerFormat),
    provideAuthEnvironment(environment.modules.auth),
    dynamicPagesInitializer(),
    provideKendoDateSettings(),
    provideAppInitializer(initTranslations),
    {
      provide: NOTIFICATION_CONTAINER,
      useFactory: () => {
        const _window = inject(WA_WINDOW);
        return { nativeElement: _window.document.body };
      },
    },
  ],
};
