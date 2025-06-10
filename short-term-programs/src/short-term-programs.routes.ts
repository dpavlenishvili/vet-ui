import { Route } from '@angular/router';
import { AppBreadCrumbItem, breadcrumb } from '@vet/shared';

const baseBreadcrumbItems: AppBreadCrumbItem[] = [{ path: '/', text: 'shared.home' }];
const baseRegistrationItems: AppBreadCrumbItem[] = [
  ...baseBreadcrumbItems,
  { path: '/programs/short', text: 'shorts.short_term_programs' },
  { path: '/programs/short/registration', text: 'shorts.registration' },
];

export const shortTermProgramsRoutes: Route[] = [
  {
    path: '',
    loadComponent: () => import('./short-term-programs.component').then((m) => m.ShortTermProgramsComponent),
    pathMatch: 'full',
    data: breadcrumb([...baseBreadcrumbItems, { path: '/programs/short', text: 'shared.short_term_programs' }]),
  },
  {
    path: 'registration',
    loadComponent: () =>
      import('./short-registration/short-registration.component').then((m) => m.ShortRegistrationComponent),
    data: breadcrumb(baseRegistrationItems),
    children: [
      {
        path: ':step',
        loadComponent: () =>
          import('./short-registration/short-registration.component').then((m) => m.ShortRegistrationComponent),
        data: breadcrumb([
          ...baseRegistrationItems,
          {
            path: (_, params) => `/programs/short/registration/${params['step']}`,
            text: (_, params) => `shorts.${params['step']}`,
          },
        ]),
      },
    ],
  },
  {
    path: ':programId',
    loadComponent: () => import('./short-program-page/short-program-page.component').then((m) => m.ShortProgramPageComponent),
    data: breadcrumb([
      ...baseBreadcrumbItems,
      { path: '/programs/short', text: 'shorts.short_term_programs' },
      { path: '/programs/short', text: 'shorts.program' },
    ]),
  },
];
