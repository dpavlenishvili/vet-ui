import { Route } from '@angular/router';
import { type AppBreadCrumbItem, breadcrumb } from '@vet/shared';

const baseBreadcrumbItems: AppBreadCrumbItem[] = [{ path: '', text: 'shared.home' }];

export const unauthorisedProgramsRoutes: Route[] = [
  {
    path: '',
    loadComponent: () => import('./unauthorised-programs.component').then((m) => m.UnauthorisedProgramsComponent),
    pathMatch: 'full',
    data: breadcrumb([...baseBreadcrumbItems, { path: '/programs', text: 'shared.programs' }]),
  },
  {
    path: ':programId',
    loadComponent: () =>
      import('./unauthorised-programs-page/unauthorised-program-page.component').then(
        (m) => m.UnauthorisedProgramPageComponent,
      ),
    data: {
      breadcrumb: [
        ...baseBreadcrumbItems,
        { path: '/programs', text: 'shared.programs' },
        { path: '/programs', text: 'shared.program' },
      ],
    },
  },
];
