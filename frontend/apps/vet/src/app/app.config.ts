import { APP_INITIALIZER, ApplicationConfig, isDevMode } from '@angular/core';
import { provideHttpClient } from '@angular/common/http';
import { provideRouter } from '@angular/router';
import { TranslocoHttpLoader } from './transloco-loader';
import { provideTransloco } from '@ngneat/transloco';
import { MainLayoutComponent } from './main-layout.component';
import { provideAngularSvgIcon } from 'angular-svg-icon';
import { setTheme } from 'ngx-bootstrap/utils';

export const appConfig: ApplicationConfig = {
    providers: [
        provideRouter([
            {
                path: '',
                component: MainLayoutComponent,
                children: [
                    {
                        // Temporary redirect to registration page
                        path: '',
                        redirectTo: 'registration',
                        pathMatch: 'full',
                    },
                    {
                        path: 'registration',
                        loadChildren: () => import('@vet/features/registration'),
                    },
                ],
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
        {
            provide: APP_INITIALIZER,
            useFactory: () => () => setTheme('bs5'),
            multi: true,
        },
    ],
};
