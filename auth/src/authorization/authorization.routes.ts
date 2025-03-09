import { inject } from '@angular/core';
import { RedirectCommand, Router, Routes } from '@angular/router';
import { type AppBreadCrumbItem, breadcrumb } from '@vet/shared';
import { AuthorizationPageLocalStateService } from './authorization-page-local-state.service';

export const getAuthorizationRoutes: (bs: AppBreadCrumbItem[]) => Routes = (baseBreadcrumbItems) => [
  {
    path: '',
    providers: [AuthorizationPageLocalStateService],
    loadComponent: () => import('./authorization-page.component').then((m) => m.AuthorizationPageComponent),
    data: breadcrumb([...baseBreadcrumbItems, { path: '/authorization', text: 'auth.authorization' }]),
    children: [
      {
        path: '',
        loadComponent: () => import('./login/login-page.component').then((m) => m.LoginPageComponent),
      },
      {
        path: '2fa',
        loadComponent: () => import('./2fa/two-factor-page.component').then((m) => m.TwoFactorPageComponent),
        canActivate: [
          () => {
            const router = inject(Router);
            if (!inject(AuthorizationPageLocalStateService).has2FaCredentials()) {
              return new RedirectCommand(router.parseUrl('/authorization'));
            }
            return true;
          },
        ],
      },
    ],
  },
];
