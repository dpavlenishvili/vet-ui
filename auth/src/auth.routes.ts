import { type Route } from '@angular/router';
import { type AppBreadCrumbItem, breadcrumb } from '@vet/shared/utils';

const baseBreadcrumbItems: AppBreadCrumbItem[] = [{ path: '', text: 'shared.home' }];

/**
 * Auth Routes
 *
 * Note: These routes are now under /auth prefix (changed from root '')
 * All breadcrumb paths updated to reflect /auth/registration/* structure
 */
export const authRoutes: Route[] = [
  {
    path: 'registration',
    loadComponent: () => import('./registration/registration.component').then((m) => m.RegistrationComponent),
    data: breadcrumb([...baseBreadcrumbItems, { path: null, text: 'auth.registration' }]),
    children: [
      {
        path: 'citizenship_selection',
        loadComponent: () => import('./registration/registration.component').then((m) => m.RegistrationComponent),
        data: breadcrumb([
          ...baseBreadcrumbItems,
          { path: '/auth/registration/citizenship_selection', text: 'auth.citizenship_selection' },
          { path: null, text: 'auth.registration' },
        ]),
      },
      {
        path: 'id_verification',
        loadComponent: () => import('./registration/registration.component').then((m) => m.RegistrationComponent),
        data: breadcrumb([
          ...baseBreadcrumbItems,
          { path: '/auth/registration/id_verification', text: 'auth.id_verification' },
          { path: null, text: 'auth.registration' },
        ]),
      },
      {
        path: 'contact_info',
        loadComponent: () => import('./registration/registration.component').then((m) => m.RegistrationComponent),
        data: breadcrumb([
          ...baseBreadcrumbItems,
          { path: '/auth/registration/contact_info', text: 'auth.contact_information' },
          { path: null, text: 'auth.registration' },
        ]),
      },
      {
        path: 'terms_and_conditions',
        loadComponent: () => import('./registration/registration.component').then((m) => m.RegistrationComponent),
        data: breadcrumb([
          ...baseBreadcrumbItems,
          { path: '/auth/registration/terms_and_conditions', text: 'auth.terms_and_conditions' },
          { path: null, text: 'auth.registration' },
        ]),
      },
    ],
  },
];
