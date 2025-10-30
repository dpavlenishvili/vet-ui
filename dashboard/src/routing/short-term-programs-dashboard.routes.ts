import { AppBreadCrumbItem, breadcrumb } from '@vet/shared';
import { Route } from '@angular/router';

const baseBreadcrumbItems: AppBreadCrumbItem[] = [{ path: '', text: 'shared.home' }];
const BASE_PATH = '/dashboard/programs/short';

export const shortTermProgramsDashboardRoutes: Route[] = [
  {
    path: '',
    pathMatch: 'full',
    loadComponent: () => import('@vet/short-term-programs').then((m) => m.ShortTermDashboardComponent),
    data: breadcrumb([...baseBreadcrumbItems, { path: BASE_PATH, text: 'dashboard.short_term_programs' }]),
  },
  {
    path: 'statistics',
    pathMatch: 'full',
    loadComponent: () => import('@vet/short-term-programs').then((m) => m.ShortTermStatisticsComponent),
    data: breadcrumb([
      ...baseBreadcrumbItems,
      { path: BASE_PATH, text: 'dashboard.short_term_programs' },
      { path: `${BASE_PATH}/statistics`, text: 'dashboard.statistics' },
    ]),
  },
  {
    path: 'registered-listeners',
    pathMatch: 'full',
    loadComponent: () => import('@vet/short-term-programs').then((m) => m.ShortTermRegisteredListenersComponent),
    data: breadcrumb([
      ...baseBreadcrumbItems,
      { path: BASE_PATH, text: 'dashboard.short_term_programs' },
      { path: `${BASE_PATH}/statistics`, text: 'dashboard.registered_listeners' },
    ]),
  },
  {
    path: 'statistics/:organisationId',
    loadComponent: () => import('@vet/short-term-programs').then((m) => m.ShortTermStatisticsOrganisationComponent),
    data: breadcrumb([
      ...baseBreadcrumbItems,
      { path: BASE_PATH, text: 'dashboard.short_term_programs' },
      { path: `${BASE_PATH}/statistics`, text: 'dashboard.statistics' },
      { path: `${BASE_PATH}/statistics/:organisationId`, text: (route) => route.queryParamMap.get('orgName') ?? '' },
    ]),
  },
  {
    path: 'statistics/:organisationId/:programId',
    loadComponent: () => import('@vet/short-term-programs').then((m) => m.ShortTermStatisticsProgramsComponent),
    data: breadcrumb([
      ...baseBreadcrumbItems,
      { path: BASE_PATH, text: 'dashboard.short_term_programs' },
      { path: `${BASE_PATH}/statistics`, text: 'dashboard.statistics' },
      { path: `${BASE_PATH}/statistics/:organisationId`, text: '...' },
      {
        path: `${BASE_PATH}/statistics/:organisationId/:programId`,
        text: (route) => route.queryParamMap.get('programName') ?? '',
      },
    ]),
  },
];
