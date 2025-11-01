import { Route, ActivatedRouteSnapshot } from '@angular/router';
import { type AppBreadCrumbItem, breadcrumb } from '@vet/shared';

const baseBreadcrumbItems: AppBreadCrumbItem[] = [{ path: '', text: 'shared.home' }];

export const unauthorisedProgramsRoutes: Route[] = [
  {
    path: '',
    loadComponent: () => import('./unauthorised-programs.component').then((m) => m.UnauthorisedProgramsComponent),
    pathMatch: 'full',
    data: breadcrumb([...baseBreadcrumbItems, { path: '/programs', text: 'shared.profession_programs' }]),
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
        { path: '/programs', text: 'shared.profession_programs' },
        { path: '/programs', text: (route: ActivatedRouteSnapshot) => route.queryParamMap.get('programName') ?? '' },
      ],
    },
  },
];
