import type { Route } from '@angular/router';
import { type AppBreadCrumbItem, breadcrumb } from '@vet/shared';

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
          { path: '/long-term-programs/registration', text: 'programs.long-term-programs-admissionRegistration' },
          { path: '/register-admission/general_information', text: 'programs.general_information' },
        ]),
      }
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
          { path: '/long-term-programs/update-admission', text: 'programs.long-term-programs-admissionUpdate' },
          { path: '/update-admission/:admissionId/general_information', text: 'programs.general_information' },
        ]),
      },
      {
        path: 'ssm_status',
            loadComponent: () =>
      import('./admission-update/admission-update.component').then((m) => m.AdmissionUpdateComponent),
        data: breadcrumb([
          ...baseBreadcrumbItems,
          { path: '/long-term-programs/list', text: 'programs.long-term-programs' },
          { path: '/long-term-programs/update-admission', text: 'programs.long-term-programs-admissionUpdate' },
          { path: '/update-admission/:admissionId/ssm_status', text: 'programs.ssm_status' },
        ]),
      },
      {
        path: 'program_selection',
            loadComponent: () =>
      import('./admission-update/admission-update.component').then((m) => m.AdmissionUpdateComponent),
        data: breadcrumb([
          ...baseBreadcrumbItems,
          { path: '/long-term-programs/list', text: 'programs.long-term-programs' },
          { path: '/long-term-programs/update-admission', text: 'programs.long-term-programs-admissionUpdate' },
          { path: '/update-admission/:admissionId/program_selection', text: 'programs.program_selection' },
        ]),
      },
      {
        path: 'selected_programs',
            loadComponent: () =>
      import('./admission-update/admission-update.component').then((m) => m.AdmissionUpdateComponent),
        data: breadcrumb([
          ...baseBreadcrumbItems,
          { path: '/long-term-programs/list', text: 'programs.long-term-programs' },
          { path: '/long-term-programs/update-admission', text: 'programs.long-term-programs-admissionUpdate' },
          { path: '/update-admission/:admissionId/selected_programs', text: 'programs.selected_programs' },
        ]),
      },
      {
        path: 'confirmation',
            loadComponent: () =>
      import('./admission-update/admission-update.component').then((m) => m.AdmissionUpdateComponent),
        data: breadcrumb([
          ...baseBreadcrumbItems,
          { path: '/long-term-programs/list', text: 'programs.long-term-programs' },
          { path: '/long-term-programs/update-admission', text: 'programs.long-term-programs-admissionUpdate' },
          { path: '/update-admission/:admissionId/confirmation', text: 'programs.confirmation' },
        ]),
      },
    ],
  },
  {
    path: '',
    loadComponent: () =>
      import('./long-term-programs-sidebar-layout/long-term-programs-sidebar-layout.component')
        .then((m) => m.LongTermProgramsSidebarLayoutComponent),
    children: [
      {
        path: 'list',
        loadComponent: () => import('./admissions-list-container/admissions-list-container.component').then((m) => m.AdmissionsListContainerComponent),
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
    ]
  },
];
