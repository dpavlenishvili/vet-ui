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
    data: breadcrumb([...baseBreadcrumbItems, { path: '/registration', text: 'auth.registration' }]),
    children: [
      {
        path: 'citizenship_selection',
        loadComponent: () => import('./registration/registration.component').then((m) => m.RegistrationComponent),
        data: breadcrumb([
          ...baseBreadcrumbItems,
          { path: '/registration', text: 'auth.registration' },
          { path: '/registration/citizenship_selection', text: 'auth.citizenship_selection' },
        ]),
      },
      {
        path: 'id_verification',
        loadComponent: () => import('./registration/registration.component').then((m) => m.RegistrationComponent),
        data: breadcrumb([
          ...baseBreadcrumbItems,
          { path: '/registration', text: 'auth.registration' },
          { path: '/registration/id_verification', text: 'auth.id_verification' },
        ]),
      },
      {
        path: 'id_verification',
        loadComponent: () => import('./registration/registration.component').then((m) => m.RegistrationComponent),
        data: breadcrumb([
          ...baseBreadcrumbItems,
          { path: '/registration', text: 'auth.registration' },
          { path: '/registration/id_verification', text: 'auth.id_verification' },
        ]),
      },
      {
        path: 'phone_verification',
        loadComponent: () => import('./registration/registration.component').then((m) => m.RegistrationComponent),
        data: breadcrumb([
          ...baseBreadcrumbItems,
          { path: '/registration', text: 'auth.registration' },
          { path: '/registration/phone_verification', text: 'auth.phone_verification' },
        ]),
      },
      {
        path: 'password_creation',
        loadComponent: () => import('./registration/registration.component').then((m) => m.RegistrationComponent),
        data: breadcrumb([
          ...baseBreadcrumbItems,
          { path: '/registration', text: 'auth.registration' },
          { path: '/registration/password_creation', text: 'auth.password_creation' },
        ]),
      },
      {
        path: 'terms_and_conditions',
        loadComponent: () => import('./registration/registration.component').then((m) => m.RegistrationComponent),
        data: breadcrumb([
          ...baseBreadcrumbItems,
          { path: '/registration', text: 'auth.registration' },
          { path: '/registration/terms_and_conditions', text: 'auth.terms_and_conditions' },
        ]),
      },
    ]
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
];
