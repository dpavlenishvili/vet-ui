import { type Route } from '@angular/router';
import { type AppBreadCrumbItem, breadcrumb } from '@vet/shared';

const baseBreadcrumbItems: AppBreadCrumbItem[] = [{ path: '/', text: 'shared.home' }];

export const authRoutes: Route[] = [
  {
    path: 'authorization',
    loadComponent: () => import('./authorization/authorization.component').then((m) => m.AuthorizationComponent),
    data: breadcrumb([...baseBreadcrumbItems, { path: '/authorization', text: 'auth.authorization' }]),
  },
  {
    path: 'registration',
    loadComponent: () => import('./registration/registration.component').then((m) => m.RegistrationComponent),
    data: breadcrumb([...baseBreadcrumbItems, { path: '/authorization', text: 'auth.registration' }]),
  },
  {
    path: 'password/forgot',
    loadComponent: () => import('./password-forgot/password-forgot.component').then((m) => m.PasswordForgotComponent),
    data: breadcrumb([...baseBreadcrumbItems, { path: '/authorization', text: 'auth.password_recovery' }]),
  },
  {
    path: 'password/reset',
    loadComponent: () => import('./password-reset/password-reset.component').then((m) => m.PasswordResetComponent),
    data: breadcrumb([...baseBreadcrumbItems, { path: '/authorization', text: 'auth.password_recovery' }]),
  },
  { path: '**', redirectTo: 'authorization' },
];
