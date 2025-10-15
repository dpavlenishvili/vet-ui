import { AppBreadCrumbItem, breadcrumb } from '@vet/shared';
import { Route } from '@angular/router';

const BASE_PATH = '/dashboard/programs/non-formal';
const baseBreadcrumbItems: AppBreadCrumbItem[] = [
  { path: '', text: 'shared.home' },
  { path: BASE_PATH, text: 'dashboard.non_formal_programs' },
];

export const nonFormalProgramsDashboardRoutes: Route[] = [
  {
    path: '',
    pathMatch: 'full',
    loadComponent: () =>
      import('@vet/non-formal-programs').then((m) => m.NonFormalApplicationsListComponent),
    data: breadcrumb([...baseBreadcrumbItems]),
  },
];