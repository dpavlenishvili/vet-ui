import { ApplicationConfig, isDevMode } from '@angular/core';
import { provideRouter } from '@angular/router';
import { TranslocoHttpLoader } from './transloco-loader';
import { provideTransloco } from '@ngneat/transloco';
import { provideHttpClient } from '@angular/common/http';

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
    ],
};
