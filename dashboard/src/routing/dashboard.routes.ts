import { Route } from '@angular/router';
import { longTermProgramsDashboardRoutes } from './long-term-programs-dashboard.routes';
import { shortTermProgramsDashboardRoutes } from './short-term-programs-dashboard.routes';
import { breadcrumb } from '@vet/shared';

export const dashboardRoutes: Route[] = [
  {
    path: '',
    loadComponent: () =>
      import('../dashboard-layout/dashboard-layout.component').then((m) => m.DashboardLayoutComponent),
    children: [
      {
        path: '',
        pathMatch: 'full',
        canActivate: [],
        redirectTo: '',
      },
      {
        path: 'programs/long',
        children: longTermProgramsDashboardRoutes,
        data: breadcrumb([]),
      },
      {
        path: 'programs/short',
        children: shortTermProgramsDashboardRoutes,
        data: breadcrumb([]),
      },
    ],
  },
];
