import { Route } from '@angular/router';
import { AppBreadCrumbItem, breadcrumb } from '@vet/shared';

const baseBreadcrumbItems: AppBreadCrumbItem[] = [
    { path: '/', text: 'shared.home' },
];

export const authRoutes: Route[] = [
    {
        path: 'authorization',
        loadComponent: () => import('./authorization/authorization.component').then((m) => m.AuthorizationComponent),
        data: breadcrumb([
            ...baseBreadcrumbItems,
            { path: '/authorization', text: 'auth.authorization' },
        ]),
    },
    {
        path: 'registration',
        loadComponent: () => import('./registration/registration.component').then((m) => m.RegistrationComponent),
        data: breadcrumb([
            ...baseBreadcrumbItems,
            { path: '/authorization', text: 'auth.registration' },
        ]),
    },
    {
        path: 'password/forgot',
        loadComponent: () => import('./password-forgot/password-forgot.component').then((m) => m.PasswordForgotComponent),
        data: breadcrumb([
            ...baseBreadcrumbItems,
            { path: '/authorization', text: 'auth.password_recovery' },
        ]),
    },
    {
        path: 'password/recovery',
        loadComponent: () => import('./password-recovery/password-recovery.component').then((m) => m.PasswordRecoveryComponent),
        data: breadcrumb([
            ...baseBreadcrumbItems,
            { path: '/authorization', text: 'auth.password_recovery' },
        ]),
    },
    { path: '**', redirectTo: 'authorization' },
];
