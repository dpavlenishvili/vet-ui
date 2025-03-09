import type { Route } from '@angular/router';

export const userProfileRoutes: Route[] = [
  {
    path: '',
    loadComponent: () => import('./user-profile.component').then((r) => r.UserProfileComponent),
    children: [
      {
        path: '',
        redirectTo: 'overview',
        pathMatch: 'full',
      },
      {
        path: 'overview',
        loadComponent: () => import('./user-overview/user-overview.component').then((m) => m.UserOverviewComponent),
      },
      {
        path: 'password',
        loadComponent: () =>
          import('./user-password-change/user-password-change.component').then((m) => m.UserPasswordChangeComponent),
      },
    ],
  },
];
