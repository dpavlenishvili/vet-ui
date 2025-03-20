import type { Route } from '@angular/router';
import { type AppBreadCrumbItem, breadcrumb } from '@vet/shared';

const baseBreadcrumbItems: AppBreadCrumbItem[] = [{ path: '/', text: 'shared.home' }];

export const longTermProgramsRoutes: Route[] = [
  {
    path: 'register-admission',
    loadComponent: () =>
      import('./admission-registration/admission-registration.component').then((m) => m.AdmissionRegistrationComponent),
    pathMatch: 'full',
    data: breadcrumb([
      ...baseBreadcrumbItems,
      { path: '/long-term-programs/list', text: 'programs.long-term-programs' },
      { path: '/long-term-programs/registration', text: 'programs.long-term-programs-admissionRegistration' },
    ]),
  },
  {
    path: 'update-admission/:admissionId',
    loadComponent: () =>
      import('./admission-update/admission-update.component').then((m) => m.AdmissionUpdateComponent),
    pathMatch: 'full',
    data: breadcrumb([
      ...baseBreadcrumbItems,
      { path: '/long-term-programs/list', text: 'programs.long-term-programs' },
      { path: '/long-term-programs/update-admission', text: 'programs.long-term-programs-admissionUpdate' },
    ]),
  },
  {
    path: '',
    loadComponent: () =>
      import('./long-term-programs-sidebar-layout/long-term-programs-sidebar-layout.component')
        .then((m) => m.LongTermProgramsSidebarLayoutComponent),
    children: [
      {
        path: 'list',
        loadComponent: () => import('./admissions-list/admissions-list.component').then((m) => m.AdmissionsListComponent),
        pathMatch: 'full',
        data: breadcrumb([
          ...baseBreadcrumbItems,
          { path: '/long-programs/list', text: 'programs.long-term-programs' },
        ]),
      },
    ]
  },
];
