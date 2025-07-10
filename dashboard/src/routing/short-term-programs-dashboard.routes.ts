import { AppBreadCrumbItem, breadcrumb } from '@vet/shared';
import { Route } from '@angular/router';

const baseBreadcrumbItems: AppBreadCrumbItem[] = [{ path: '', text: 'shared.home' }];
const BASE_PATH = '/dashboard/programs/short';

export const shortTermProgramsDashboardRoutes: Route[] = [
  {
    path: '',
    pathMatch: 'full',
    loadComponent: () => import('@vet/short-term-programs').then((m) => m.ShortTermDashboardComponent),
    data: breadcrumb([...baseBreadcrumbItems, { path: BASE_PATH, text: 'dashboard.long_term_programs' }]),
  },
];
