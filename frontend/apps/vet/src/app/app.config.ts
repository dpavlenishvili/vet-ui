import { ApplicationConfig, importProvidersFrom } from '@angular/core';
import { provideHttpClient, withFetch } from '@angular/common/http';
import { provideRouter } from '@angular/router';
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

export const appConfig: ApplicationConfig = {
    providers: [
        provideAnimations(),
        provideRouter(appRoutes),
        provideHttpClient(withFetch()),
        initializeTransolco(),
        provideAngularSvgIcon(),
        useBs5Theme(),
        provideDatepicker(),
        provideClientHydration(),
        provideBaseUrl(environment.apiBaseUrl),
        importProvidersFrom(ModalModule.forRoot()),
    ],
};
