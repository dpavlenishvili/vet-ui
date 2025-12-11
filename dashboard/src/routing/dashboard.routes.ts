import { Route } from '@angular/router';
import { breadcrumb } from '@vet/shared/utils';

/**
 * Dashboard Routes
 *
 * Note: authenticatedGuard is applied at the parent route level in app.routes.ts
 * All child routes are protected by inheritance.
 */
export const dashboardRoutes: Route[] = [
  {
    path: '',
    loadComponent: () =>
      import('../dashboard-layout/dashboard-layout.component')
        .then((m) => m.DashboardLayoutComponent),
    // No guard needed - parent route has authenticatedGuard
    children: [
      {
        path: '',
        pathMatch: 'full',
        redirectTo: 'programs/long', // Default dashboard view
      },
      {
        path: 'programs/long',
        data: breadcrumb([]),
        loadChildren: () =>
          import('./long-term-programs-dashboard.routes')
            .then((m) => m.longTermProgramsDashboardRoutes),
      },
      {
        path: 'programs/short',
        data: breadcrumb([]),
        loadChildren: () =>
          import('./short-term-programs-dashboard.routes')
            .then((m) => m.shortTermProgramsDashboardRoutes),
      },
      {
        path: 'programs/non-formal',
        data: breadcrumb([]),
        loadChildren: () =>
          import('./non-formal-programs-dashboard.routes')
            .then((m) => m.nonFormalProgramsDashboardRoutes),
      },
    ],
  },
];
