import { ApplicationConfig } from '@angular/core';
import { provideHttpClient } from '@angular/common/http';
import { provideRouter } from '@angular/router';
import { initializeTransolco } from './initialize-transloco';
import { provideAngularSvgIcon } from 'angular-svg-icon';
import { provideAnimations } from '@angular/platform-browser/animations';
import { provideDatepicker } from '@vet/ui/datepicker';
import { useBs5Theme } from './use-bs5-theme';
import { appRoutes } from './app.routes';

export const appConfig: ApplicationConfig = {
    providers: [
        provideAnimations(),
        provideRouter(appRoutes),
        provideHttpClient(),
        initializeTransolco(),
        provideAngularSvgIcon(),
        useBs5Theme(),
        provideDatepicker(),
    ],
};
