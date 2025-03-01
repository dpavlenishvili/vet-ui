import type { Route } from '@angular/router';
import { type AppBreadCrumbItem, breadcrumb } from '@vet/shared';

const baseBreadcrumbItems: AppBreadCrumbItem[] = [{ path: '/', text: 'shared.home' }];

export const programsRoutes: Route[] = [
  {
    path: '',
    loadComponent: () => import('./programs.component').then((m) => m.ProgramsComponent),
    pathMatch: 'full',
    data: breadcrumb([...baseBreadcrumbItems, { path: '/programs', text: 'shared.programs' }]),
  },
  {
    path: ':programId',
    loadComponent: () => import('./program/program.component').then((m) => m.ProgramComponent),
    data: breadcrumb([
      ...baseBreadcrumbItems,
    ]),
  },
];
