import { Routes } from '@angular/router';

const routes: Routes = [
    {
        path: '',
        loadComponent: () =>
            import('./lib/features-authentication/features-authentication.component').then(
                (m) => m.FeaturesAuthenticationComponent,
            ),
    },
    {
        path: 'reset-password',
        loadComponent: () =>
            import('./lib/features-reset-password/features-reset-password.component').then(
                (m) => m.FeaturesResetPasswordComponent,
            ),
    },
];

export default routes;
