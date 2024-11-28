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
            { path: '/authorization', text: 'shared.password_recovery' },
        ]),
    },
    {
        path: 'registration',
        loadComponent: () => import('./registration/registration.component').then((m) => m.RegistrationComponent),
        data: breadcrumb([
            ...baseBreadcrumbItems,
            { path: '/authorization', text: 'shared.registration' },
        ]),
    },
    { path: '**', redirectTo: 'authorization' },
];
