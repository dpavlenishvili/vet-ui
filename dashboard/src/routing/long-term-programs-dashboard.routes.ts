import { AppBreadCrumbItem, breadcrumb } from '@vet/shared';
import { Route } from '@angular/router';

const baseBreadcrumbItems: AppBreadCrumbItem[] = [{ path: '', text: 'shared.home' }];
const BASE_PATH = '/dashboard/programs/long';

export const longTermProgramsDashboardRoutes: Route[] = [
  {
    path: '',
    pathMatch: 'full',
    loadComponent: () =>
      import('@vet/long-term-programs').then((m) => m.AdmissionsListComponent),
    data: breadcrumb([
      ...baseBreadcrumbItems,
      { path: BASE_PATH, text: 'dashboard.long_term_programs' },
    ]),
  },
  {
    path: 'commission/members',
    loadComponent: () =>
      import('@vet/long-term-programs').then((m) => m.CommissionMembersComponent),
    pathMatch: 'full',
    data: breadcrumb([
      ...baseBreadcrumbItems,
      { path: `${BASE_PATH}/commission/members`, text: 'dashboard.commission_members' },
    ]),
  },
  {
    path: 'commission/review',
    loadComponent: () =>
      import('@vet/long-term-programs').then((m) => m.CommissionReviewComponent),
    pathMatch: 'full',
    data: breadcrumb([
      ...baseBreadcrumbItems,
      { path: `${BASE_PATH}/commission/review`, text: 'dashboard.commission_grading' },
    ]),
  },
  {
    path: 'commission/results',
    loadComponent: () =>
      import('@vet/long-term-programs').then((m) => m.CommissionResultsComponent),
    pathMatch: 'full',
    data: breadcrumb([
      ...baseBreadcrumbItems,
      { path: `${BASE_PATH}/commission/results`, text: 'dashboard.commission_results' },
    ]),
  },
  {
    path: 'exam/card',
    loadComponent: () => import('@vet/long-term-programs').then((m) => m.ExamCardComponent),
    pathMatch: 'full',
    data: breadcrumb([
      ...baseBreadcrumbItems,
      { path: `${BASE_PATH}/exam/card`, text: 'dashboard.exam_card' },
    ]),
  },
  {
    path: 'exam/selection',
    loadComponent: () => import('@vet/long-term-programs').then((m) => m.ExamSelectionComponent),
    pathMatch: 'full',
    data: breadcrumb([
      ...baseBreadcrumbItems,
      { path: `${BASE_PATH}/exam/selection`, text: 'dashboard.exam_selection' },
    ]),
  },
  {
    path: 'statistics',
    loadComponent: () =>
      import('@vet/long-term-programs').then((m) => m.LongTermStatisticsComponent),
    pathMatch: 'full',
    data: breadcrumb([
      ...baseBreadcrumbItems,
      { path: `${BASE_PATH}/statistics`, text: 'programs.statistics' },
    ]),
  },
];
