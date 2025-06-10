import type {Route} from '@angular/router';
import {type AppBreadCrumbItem, breadcrumb} from '@vet/shared';

const baseBreadcrumbItems: AppBreadCrumbItem[] = [{ path: '/', text: 'shared.home' }];

export const longTermProgramsRoutes: Route[] = [
  {
    path: 'register-admission',
    loadComponent: () =>
      import('./admission-registration/admission-registration.component').then((m) => m.AdmissionRegistrationComponent),
    data: breadcrumb([
      ...baseBreadcrumbItems,
      { path: '/long-term-programs/list', text: 'programs.long-term-programs' },
      { path: '/long-term-programs/registration', text: 'programs.long-term-programs-admissionRegistration' },
    ]),
    children: [
      {
        path: 'general_information',
        loadComponent: () =>
          import('./admission-update/admission-update.component').then((m) => m.AdmissionUpdateComponent),
        data: breadcrumb([
          ...baseBreadcrumbItems,
          { path: '/long-term-programs/list', text: 'programs.long-term-programs' },
          { path: null, text: 'programs.general_information' },
          { path: null, text: 'programs.long-term-programs-admissionRegistration' },
        ]),
      },
    ],
  },
  {
    path: 'update-admission/:admissionId',
    loadComponent: () =>
      import('./admission-update/admission-update.component').then((m) => m.AdmissionUpdateComponent),
    data: breadcrumb([
      ...baseBreadcrumbItems,
      { path: '/long-term-programs/list', text: 'programs.long-term-programs' },
    ]),
    children: [
      {
        path: 'general_information',
        loadComponent: () =>
          import('./admission-update/admission-update.component').then((m) => m.AdmissionUpdateComponent),
        data: breadcrumb([
          ...baseBreadcrumbItems,
          { path: '/long-term-programs/list', text: 'programs.long-term-programs' },
          {
            path: null,
            text: 'programs.general_information',
          },
          { path: null, text: 'programs.long-term-programs-admissionUpdate' },
        ]),
      },
      {
        path: 'ssm_status',
        loadComponent: () =>
          import('./admission-update/admission-update.component').then((m) => m.AdmissionUpdateComponent),
        data: breadcrumb([
          ...baseBreadcrumbItems,
          { path: '/long-term-programs/list', text: 'programs.long-term-programs' },
          { path: null, text: 'programs.ssm_status' },
          { path: null, text: 'programs.long-term-programs-admissionUpdate' },
        ]),
      },
      {
        path: 'program_selection',
        loadComponent: () =>
          import('./admission-update/admission-update.component').then((m) => m.AdmissionUpdateComponent),
        data: breadcrumb([
          ...baseBreadcrumbItems,
          { path: '/long-term-programs/list', text: 'programs.long-term-programs' },
          { path: null, text: 'programs.program_selection' },
          { path: null, text: 'programs.long-term-programs-admissionUpdate' },
        ]),
      },
      {
        path: 'selected_programs',
        loadComponent: () =>
          import('./admission-update/admission-update.component').then((m) => m.AdmissionUpdateComponent),
        data: breadcrumb([
          ...baseBreadcrumbItems,
          { path: '/long-term-programs/list', text: 'programs.long-term-programs' },
          { path: null, text: 'programs.selected_programs' },
          { path: null, text: 'programs.long-term-programs-admissionUpdate' },
        ]),
      },
      {
        path: 'confirmation',
        loadComponent: () =>
          import('./admission-update/admission-update.component').then((m) => m.AdmissionUpdateComponent),
        data: breadcrumb([
          ...baseBreadcrumbItems,
          { path: '/long-term-programs/list', text: 'programs.long-term-programs' },
          { path: null, text: 'programs.confirmation' },
          { path: null, text: 'programs.long-term-programs-admissionUpdate' },
        ]),
      },
    ],
  },
  {
    path: '',
    loadComponent: () =>
      import('./long-term-programs-sidebar-layout/long-term-programs-sidebar-layout.component').then(
        (m) => m.LongTermProgramsSidebarLayoutComponent,
      ),
    children: [
      {
        path: 'list',
        loadComponent: () =>
          import('./admissions-list/admissions-list.component').then((m) => m.AdmissionsListComponent),
        pathMatch: 'full',
        data: breadcrumb([
          ...baseBreadcrumbItems,
          { path: '/long-programs/list', text: 'programs.long-term-programs' },
        ]),
      },
      {
        path: 'commission-members',
        loadComponent: () =>
          import('./commission-members/commission-members.component').then((m) => m.CommissionMembersComponent),
        pathMatch: 'full',
        data: breadcrumb([
          ...baseBreadcrumbItems,
          { path: '/long-programs/commission-members', text: 'programs.commission-members' },
        ]),
      },
      {
        path: 'commission-review',
        loadComponent: () =>
          import('./commission-review/commission-review.component').then((m) => m.CommissionReviewComponent),
        pathMatch: 'full',
        data: breadcrumb([
          ...baseBreadcrumbItems,
          { path: '/long-programs/commission-review', text: 'programs.commissionGrade' },
        ]),
      },
      {
        path: 'commission-results',
        loadComponent: () =>
          import('./commission-results/commission-results.component').then((m) => m.CommissionResultsComponent),
        pathMatch: 'full',
        data: breadcrumb([
          ...baseBreadcrumbItems,
          { path: '/long-programs/commission-results', text: 'programs.commissionResults' },
        ]),
      },
      {
        path: 'exam-card',
        loadComponent: () => import('./exam-card/exam-card.component').then((m) => m.ExamCardComponent),
        pathMatch: 'full',
        data: breadcrumb([...baseBreadcrumbItems, { path: '/long-programs/exam-card', text: 'programs.testingCard' }]),
      },
      {
        path: 'exam-selection',
        loadComponent: () => import('./exam-selection/exam-selection.component').then((m) => m.ExamSelectionComponent),
        pathMatch: 'full',
        data: breadcrumb([
          ...baseBreadcrumbItems,
          { path: '/long-programs/exam-selection', text: 'programs.examSelection' },
        ]),
      },
    ],
  },
];
