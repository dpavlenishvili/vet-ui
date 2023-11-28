import { provideRouter } from '@angular/router';
import { ApplicationConfig, isDevMode } from '@angular/core';
import { TranslocoHttpLoader } from './transloco-loader';
import { provideTransloco } from '@ngneat/transloco';
import { provideHttpClient } from '@angular/common/http';
import { provideAngularSvgIcon } from 'angular-svg-icon';

export const appConfig: ApplicationConfig = {
    providers: [
        provideRouter([
            {
                path: 'registration',
                loadChildren: () => import('@vet/features/registration'),
            },
        ]),
        provideHttpClient(),
        provideTransloco({
            config: {
                availableLangs: ['ka', 'en'],
                defaultLang: 'ka',
                // Remove this option if your application doesn't support changing language in runtime.
                reRenderOnLangChange: true,
                prodMode: !isDevMode(),
            },
            loader: TranslocoHttpLoader,
        }),
        provideAngularSvgIcon(),
    ],
};
