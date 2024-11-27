import { Route } from '@angular/router';

export const authRoutes: Route[] = [
    {
        path: 'authorization',
        loadComponent: () => import('./authorization/authorization.component').then((m) => m.AuthorizationComponent),
    },
    {
        path: 'registration',
        loadComponent: () => import('./registration/registration.component').then((m) => m.RegistrationComponent),
    },
    { path: '**', redirectTo: 'authorization' },
];
