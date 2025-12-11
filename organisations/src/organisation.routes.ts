import { Route } from '@angular/router';
import { type AppBreadCrumbItem, breadcrumb } from '@vet/shared/utils';

const baseBreadcrumbItems: AppBreadCrumbItem[] = [{ path: '', text: 'shared.home' }];

export const organisationsRoutes: Route[] = [
  {
    path: '',
    loadComponent: () => import('./organisations.component').then((m) => m.OrganisationsComponent),
    pathMatch: 'full',
    data: breadcrumb([...baseBreadcrumbItems, { path: '/organisations', text: 'shared.organisations' }]),
  },
  {
    path: ':institutionId',
    loadComponent: () =>
      import('./organisation-page/organisation-page.component').then((m) => m.OrganisationPageComponent),
    pathMatch: 'full',
    data: breadcrumb([...baseBreadcrumbItems, { path: '/organisations', text: 'shared.organisations' }]),
  },
];
