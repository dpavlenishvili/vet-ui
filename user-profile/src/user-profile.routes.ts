import type { Route } from '@angular/router';
import { type AppBreadCrumbItem, breadcrumb } from '@vet/shared/utils';

const baseBreadcrumbItems: AppBreadCrumbItem[] = [{ path: '', text: 'shared.home' }];

export const userProfileRoutes: Route[] = [
  {
    path: '',
    loadComponent: () => import('./user-profile.component').then((r) => r.UserProfileComponent),
    children: [
      {
        path: '',
        redirectTo: 'overview',
        pathMatch: 'full',
        data: breadcrumb([...baseBreadcrumbItems, { path: '/user-profile', text: 'profile.my_profile' }]),
      },
      {
        path: 'overview',
        loadComponent: () => import('./user-overview/user-overview.component').then((m) => m.UserOverviewComponent),
        pathMatch: 'full',
        data: breadcrumb([...baseBreadcrumbItems, { path: '/user-profile/overview', text: 'profile.my_profile' }]),
      },
    ],
  },
];
