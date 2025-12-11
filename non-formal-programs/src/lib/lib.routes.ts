import { Route } from '@angular/router';
import { AppBreadCrumbItem, breadcrumb } from '@vet/shared/utils';
import { authenticatedGuard, mandatoryFieldsGuard, unAuthenticatedGuard } from '@vet/auth';

const baseBreadcrumbItems: AppBreadCrumbItem[] = [{ path: '', text: 'shared.home' }];

export const nonFormalProgramsRoutes: Route[] = [
  {
    path: '',
    loadComponent: () => import('./non-formal-programs.component').then((m) => m.NonFormalProgramsComponent),
    pathMatch: 'full',
    canActivate: [unAuthenticatedGuard],
    data: breadcrumb([...baseBreadcrumbItems, { path: '/programs/non-formal', text: 'non_formal.programs' }]),
  },
  {
    path: 'applications',
    loadComponent: () =>
      import('./non-formal-applications-list/non-formal-applications-list.component').then(
        (m) => m.NonFormalApplicationsListComponent,
      ),
    canActivate: [authenticatedGuard],
    data: breadcrumb([
      ...baseBreadcrumbItems,
      { path: '/dashboard/programs/non-formal', text: 'non_formal.programs' },
      { path: '/non-formal/applications', text: 'non_formal.applications' },
    ]),
  },
  {
    path: 'register-application',
    loadComponent: () =>
      import('./application-registration/application-registration.component').then(
        (m) => m.ApplicationRegistrationComponent,
      ),
    canActivate: [authenticatedGuard, mandatoryFieldsGuard],
    data: breadcrumb([
      ...baseBreadcrumbItems,
      { path: '/dashboard/programs/non-formal', text: 'non_formal.programs' },
      { path: '/non-formal/register-application', text: 'non_formal.registration' },
    ]),
    children: [
      {
        path: 'field-selection',
        loadComponent: () =>
          import('./application-registration/application-registration.component').then(
            (m) => m.ApplicationRegistrationComponent,
          ),
        data: breadcrumb([
          ...baseBreadcrumbItems,
          { path: '/dashboard/programs/non-formal', text: 'non_formal.programs' },
          { path: null, text: 'non_formal.field_selection' },
          { path: null, text: 'non_formal.registration' },
        ]),
      },
      {
        path: 'selected-fields',
        loadComponent: () =>
          import('./application-registration/application-registration.component').then(
            (m) => m.ApplicationRegistrationComponent,
          ),
        data: breadcrumb([
          ...baseBreadcrumbItems,
          { path: '/dashboard/programs/non-formal', text: 'non_formal.programs' },
          { path: null, text: 'non_formal.selected_fields' },
          { path: null, text: 'non_formal.registration' },
        ]),
      },
      {
        path: 'questionnaire',
        loadComponent: () =>
          import('./application-registration/application-registration.component').then(
            (m) => m.ApplicationRegistrationComponent,
          ),
        data: breadcrumb([
          ...baseBreadcrumbItems,
          { path: '/dashboard/programs/non-formal', text: 'non_formal.programs' },
          { path: null, text: 'non_formal.questionnaire' },
          { path: null, text: 'non_formal.registration' },
        ]),
      },
      {
        path: 'documents',
        loadComponent: () =>
          import('./application-registration/application-registration.component').then(
            (m) => m.ApplicationRegistrationComponent,
          ),
        data: breadcrumb([
          ...baseBreadcrumbItems,
          { path: '/dashboard/programs/non-formal', text: 'non_formal.programs' },
          { path: null, text: 'non_formal.documents' },
          { path: null, text: 'non_formal.registration' },
        ]),
      },
      {
        path: 'confirmation',
        loadComponent: () =>
          import('./application-registration/application-registration.component').then(
            (m) => m.ApplicationRegistrationComponent,
          ),
        data: breadcrumb([
          ...baseBreadcrumbItems,
          { path: '/dashboard/programs/non-formal', text: 'non_formal.programs' },
          { path: null, text: 'non_formal.confirmation' },
          { path: null, text: 'non_formal.registration' },
        ]),
      },
    ],
  },
  {
    path: 'update-application/:applicationId',
    loadComponent: () =>
      import('./application-update/application-update.component').then((m) => m.ApplicationUpdateComponent),
    canActivate: [authenticatedGuard, mandatoryFieldsGuard],
    data: breadcrumb([...baseBreadcrumbItems, { path: '/dashboard/programs/non-formal', text: 'non_formal.programs' }]),
    children: [
      {
        path: 'field-selection',
        loadComponent: () =>
          import('./application-update/application-update.component').then((m) => m.ApplicationUpdateComponent),
        data: breadcrumb([
          ...baseBreadcrumbItems,
          { path: '/dashboard/programs/non-formal', text: 'non_formal.programs' },
          { path: null, text: 'non_formal.field_selection' },
          { path: null, text: 'non_formal.update' },
        ]),
      },
      {
        path: 'selected-fields',
        loadComponent: () =>
          import('./application-update/application-update.component').then((m) => m.ApplicationUpdateComponent),
        data: breadcrumb([
          ...baseBreadcrumbItems,
          { path: '/dashboard/programs/non-formal', text: 'non_formal.programs' },
          { path: null, text: 'non_formal.selected_fields' },
          { path: null, text: 'non_formal.update' },
        ]),
      },
      {
        path: 'questionnaire',
        loadComponent: () =>
          import('./application-update/application-update.component').then((m) => m.ApplicationUpdateComponent),
        data: breadcrumb([
          ...baseBreadcrumbItems,
          { path: '/dashboard/programs/non-formal', text: 'non_formal.programs' },
          { path: null, text: 'non_formal.questionnaire' },
          { path: null, text: 'non_formal.update' },
        ]),
      },
      {
        path: 'documents',
        loadComponent: () =>
          import('./application-update/application-update.component').then((m) => m.ApplicationUpdateComponent),
        data: breadcrumb([
          ...baseBreadcrumbItems,
          { path: '/dashboard/programs/non-formal', text: 'non_formal.programs' },
          { path: null, text: 'non_formal.documents' },
          { path: null, text: 'non_formal.update' },
        ]),
      },
      {
        path: 'confirmation',
        loadComponent: () =>
          import('./application-update/application-update.component').then((m) => m.ApplicationUpdateComponent),
        data: breadcrumb([
          ...baseBreadcrumbItems,
          { path: '/dashboard/programs/non-formal', text: 'non_formal.programs' },
          { path: null, text: 'non_formal.confirmation' },
          { path: null, text: 'non_formal.update' },
        ]),
      },
    ],
  },
  {
    path: 'view-application/:applicationId',
    loadComponent: () =>
      import('./application-view/application-view.component').then((m) => m.ApplicationViewComponent),
    canActivate: [authenticatedGuard],
    data: breadcrumb([
      ...baseBreadcrumbItems,
      { path: '/dashboard/programs/non-formal', text: 'non_formal.programs' },
      { path: null, text: 'non_formal.view' },
    ]),
    children: [
      {
        path: 'field-selection',
        loadComponent: () =>
          import('./application-view/application-view.component').then((m) => m.ApplicationViewComponent),
        data: breadcrumb([
          ...baseBreadcrumbItems,
          { path: '/dashboard/programs/non-formal', text: 'non_formal.programs' },
          { path: null, text: 'non_formal.field_selection' },
          { path: null, text: 'non_formal.view' },
        ]),
      },
      {
        path: 'selected-fields',
        loadComponent: () =>
          import('./application-view/application-view.component').then((m) => m.ApplicationViewComponent),
        data: breadcrumb([
          ...baseBreadcrumbItems,
          { path: '/dashboard/programs/non-formal', text: 'non_formal.programs' },
          { path: null, text: 'non_formal.selected_fields' },
          { path: null, text: 'non_formal.view' },
        ]),
      },
      {
        path: 'questionnaire',
        loadComponent: () =>
          import('./application-view/application-view.component').then((m) => m.ApplicationViewComponent),
        data: breadcrumb([
          ...baseBreadcrumbItems,
          { path: '/dashboard/programs/non-formal', text: 'non_formal.programs' },
          { path: null, text: 'non_formal.questionnaire' },
          { path: null, text: 'non_formal.view' },
        ]),
      },
      {
        path: 'documents',
        loadComponent: () =>
          import('./application-view/application-view.component').then((m) => m.ApplicationViewComponent),
        data: breadcrumb([
          ...baseBreadcrumbItems,
          { path: '/dashboard/programs/non-formal', text: 'non_formal.programs' },
          { path: null, text: 'non_formal.documents' },
          { path: null, text: 'non_formal.view' },
        ]),
      },
      {
        path: 'confirmation',
        loadComponent: () =>
          import('./application-view/application-view.component').then((m) => m.ApplicationViewComponent),
        data: breadcrumb([
          ...baseBreadcrumbItems,
          { path: '/dashboard/programs/non-formal', text: 'non_formal.programs' },
          { path: null, text: 'non_formal.confirmation' },
          { path: null, text: 'non_formal.view' },
        ]),
      },
    ],
  },
  {
    path: ':programId',
    loadComponent: () =>
      import('./non-formal-program-page/non-formal-program-page.component').then(
        (m) => m.NonFormalProgramPageComponent,
      ),
    canActivate: [unAuthenticatedGuard],
    data: breadcrumb([
      ...baseBreadcrumbItems,
      { path: '/programs/non-formal', text: 'non_formal.programs' },
      { path: '/programs/non-formal/:programId', text: (route) => route.queryParamMap.get('programName') ?? '' },
    ]),
  },
];
