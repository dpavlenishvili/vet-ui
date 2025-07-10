import { Routes } from '@angular/router';
import { type AppBreadCrumbItem, breadcrumb } from '@vet/shared';

export const getAuthorizationRoutes: (bs: AppBreadCrumbItem[]) => Routes = (baseBreadcrumbItems) => [
  {
    path: '',
    loadComponent: () => import('./authorization-page.component').then((m) => m.AuthorizationPageComponent),
    data: breadcrumb([...baseBreadcrumbItems, { path: '/authorization', text: 'auth.authorization' }]),
    children: [
      {
        path: '',
        loadComponent: () => import('./login/login-page.component').then((m) => m.LoginPageComponent),
      },
    ],
  },
];
