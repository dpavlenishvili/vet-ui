import type { Route } from '@angular/router';
import { type AppBreadCrumbItem, breadcrumb } from '@vet/shared';

const baseBreadcrumbItems: AppBreadCrumbItem[] = [{ path: '/', text: 'shared.home' }];

export const longTermProgramsRoutes: Route[] = [
  {
    path: 'list',
    loadComponent: () =>
      import('./admissions-list/admissions-list.component').then((m) => m.AdmissionsListComponent),
    pathMatch: 'full',
    data: breadcrumb([
      ...baseBreadcrumbItems,
      { path: '/programs', text: 'shared.programs' },
      { path: '/programs/list', text: 'programs.admissionList' },
    ]),
  },
  {
    path: 'register-admission',
    loadComponent: () =>
      import('./admission-registration/admission-registration.component').then((m) => m.AdmissionRegistrationComponent),
    pathMatch: 'full',
    data: breadcrumb([
      ...baseBreadcrumbItems,
      { path: '/programs', text: 'shared.programs' },
      { path: '/programs/registration', text: 'programs.admissionRegistration' },
    ]),
  },
  {
    path: 'update-admission/:admissionId',
    loadComponent: () =>
      import('./admission-update/admission-update.component').then((m) => m.AdmissionUpdateComponent),
    pathMatch: 'full',
    data: breadcrumb([
      ...baseBreadcrumbItems,
      { path: '/programs', text: 'shared.programs' },
      { path: '/programs/update-admission', text: 'programs.admissionUpdate' },
    ]),
  },
];
