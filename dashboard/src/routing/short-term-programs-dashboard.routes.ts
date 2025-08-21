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
  {
    path: 'statistics',
    pathMatch: 'full',
    loadComponent: () => import('@vet/short-term-programs').then((m) => m.ShortTermStatisticsComponent),
    data: breadcrumb([
      ...baseBreadcrumbItems,
      { path: BASE_PATH, text: 'dashboard.long_term_programs' },
      { path: `${BASE_PATH}/statistics`, text: 'dashboard.statistics' },
    ]),
  },
  {
    path: 'statistics/:organisationId',
    loadComponent: () =>
      import('@vet/short-term-programs').then((m) => m.ShortTermStatisticsOrganisationComponent),
    data: breadcrumb([
      ...baseBreadcrumbItems,
      { path: BASE_PATH, text: 'dashboard.long_term_programs' },
      { path: `${BASE_PATH}/statistics`, text: 'dashboard.statistics' },
    ]),
  },
  {
    path: 'statistics/:organisationId/:programId',
    loadComponent: () =>
      import('@vet/short-term-programs').then((m) => m.ShortTermStatisticsProgramsComponent),
    data: breadcrumb([
      ...baseBreadcrumbItems,
      { path: BASE_PATH, text: 'dashboard.long_term_programs' },
      { path: `${BASE_PATH}/statistics`, text: 'dashboard.statistics' },
    ]),
  },
];
