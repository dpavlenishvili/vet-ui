import type { Route } from '@angular/router';
import { ProgramsComponent } from './programs.component';
import { ProgramComponent } from './program/program.component';
import { type AppBreadCrumbItem, breadcrumb } from '@vet/shared';
import { ProgramRegistrationComponent } from './program-registration/program-registration.component';

const baseBreadcrumbItems: AppBreadCrumbItem[] = [{ path: '/', text: 'shared.home' }];

export const programsRoutes: Route[] = [
  {
    path: '',
    loadComponent: () => import('./programs.component').then((m) => m.ProgramsComponent),
    pathMatch: 'full',
    data: breadcrumb([...baseBreadcrumbItems, { path: '/programs', text: 'shared.programs' }]),
  },
  {
    path: 'registration',
    loadComponent: () =>
      import('./program-registration/program-registration.component').then((m) => m.ProgramRegistrationComponent),
    pathMatch: 'full',
    data: breadcrumb([
      ...baseBreadcrumbItems,
      { path: '/programs', text: 'shared.programs' },
      { path: '/programs', text: 'programs.program' },
      { path: '/programs/registration', text: 'programs.registration' },
    ]),
  },
  {
    path: ':programId',
    loadComponent: () => import('./program/program.component').then((m) => m.ProgramComponent),
    data: breadcrumb([
      ...baseBreadcrumbItems,
      { path: '/programs', text: 'shared.programs' },
      { path: '/programs/123', text: 'shared.program' },
    ]),
  },
];
