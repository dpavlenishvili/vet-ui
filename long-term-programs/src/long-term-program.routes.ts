import type { Route } from '@angular/router';
import { type AppBreadCrumbItem, breadcrumb } from '@vet/shared';

const baseBreadcrumbItems: AppBreadCrumbItem[] = [{ path: '', text: 'shared.home' }];

export const longTermProgramsRoutes: Route[] = [
  {
    path: 'register-admission',
    loadComponent: () =>
      import('./admission-registration/admission-registration.component').then((m) => m.AdmissionRegistrationComponent),
    data: breadcrumb([
      ...baseBreadcrumbItems,
      { path: '/dashboard/programs/long', text: 'programs.long-term-programs' },
      { path: '/long-term-programs/registration', text: 'programs.long-term-programs-admissionRegistration' },
    ]),
    children: [
      {
        path: 'general_information',
        loadComponent: () =>
          import('./admission-update/admission-update.component').then((m) => m.AdmissionUpdateComponent),
        data: breadcrumb([
          ...baseBreadcrumbItems,
          { path: '/dashboard/programs/long', text: 'programs.long-term-programs' },
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
      { path: '/dashboard/programs/long', text: 'programs.long-term-programs' },
    ]),
    children: [
      {
        path: 'general_information',
        loadComponent: () =>
          import('./admission-update/admission-update.component').then((m) => m.AdmissionUpdateComponent),
        data: breadcrumb([
          ...baseBreadcrumbItems,
          { path: '/dashboard/programs/long', text: 'programs.long-term-programs' },
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
          { path: '/dashboard/programs/long', text: 'programs.long-term-programs' },
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
          { path: '/dashboard/programs/long', text: 'programs.long-term-programs' },
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
          { path: '/dashboard/programs/long', text: 'programs.long-term-programs' },
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
          { path: '/dashboard/programs/long', text: 'programs.long-term-programs' },
          { path: null, text: 'programs.confirmation' },
          { path: null, text: 'programs.long-term-programs-admissionUpdate' },
        ]),
      },
    ],
  },
  {
    path: 'exam-card/:pid',
    loadComponent: () =>
      import('./exam-card-display/exam-card-display.component').then((m) => m.ExamCardDisplayComponent),
    data: breadcrumb([
      ...baseBreadcrumbItems,
      { path: '/dashboard/programs/long', text: 'programs.long-term-programs' },
      { path: null, text: 'programs.exam_card' },
    ]),
  },
];
