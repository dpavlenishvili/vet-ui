import { Route } from '@angular/router';
import { AppBreadCrumbItem, breadcrumb } from '@vet/shared';
import { unAuthenticatedGuard } from '@vet/auth';

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
    path: ':programId',
    loadComponent: () =>
      import('./non-formal-program-page/non-formal-program-page.component').then(
        (m) => m.NonFormalProgramPageComponent,
      ),
    canActivate: [unAuthenticatedGuard],
    data: breadcrumb([
      ...baseBreadcrumbItems,
      { path: '/programs/non-formal', text: 'non_formal.programs' },
      { path: '/programs/non-formal/:programId', text: 'non_formal.program_details' },
    ]),
  },
];
