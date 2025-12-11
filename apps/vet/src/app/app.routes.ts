import type { Routes } from '@angular/router';
import { authenticatedGuard, unAuthenticatedGuard } from '@vet/auth';
import { breadcrumb } from '@vet/shared/utils';

/**
 * VET Application Routes
 *
 * All routes are lazy-loaded for optimal bundle splitting.
 * Guards are applied at route boundaries for consistent security model.
 */
export const appRoutes: Routes = [
  // ============================================
  // DASHBOARD - Authenticated Area
  // ============================================
  {
    path: 'dashboard',
    canActivate: [authenticatedGuard], // Guard moved from internal routes
    data: breadcrumb([]),
    loadChildren: () =>
      import('@vet/dashboard').then(m => m.dashboardRoutes),
  },

  // ============================================
  // DYNAMIC PAGES - Public Content
  // ============================================
  {
    path: 'pages',
    loadChildren: () =>
      import('@vet/pages').then(m => m.pagesLayoutRoutes),
  },
  {
    path: 'article',
    loadChildren: () =>
      import('@vet/pages').then(m => m.articleRoutes),
  },

  // ============================================
  // MAIN LAYOUT - Public & Mixed Routes
  // ============================================
  {
    path: '',
    loadComponent: () =>
      import('./layouts/main-layout/main-layout.component')
        .then(m => m.MainLayoutComponent), // Lazy loaded
    children: [
      // =====================================
      // Home (Public)
      // =====================================
      {
        path: '',
        pathMatch: 'full',
        loadChildren: () =>
          import('@vet/home').then(m => m.homeRoutes),
      },

      // =====================================
      // Program Listings
      // =====================================
      {
        path: 'programs',
        children: [
          // Public program catalog
          {
            path: '',
            pathMatch: 'full',
            canActivate: [unAuthenticatedGuard],
            data: breadcrumb([]),
            loadChildren: () =>
              import('@vet/unauthorised-programs')
                .then(m => m.unauthorisedProgramsRoutes),
          },
          // Short-term programs (mixed public/auth)
          {
            path: 'short',
            data: breadcrumb([]),
            loadChildren: () =>
              import('@vet/short-term-programs')
                .then(m => m.shortTermProgramsRoutes),
          },
          // Non-formal programs (mixed public/auth)
          {
            path: 'non-formal',
            data: breadcrumb([]),
            loadChildren: () =>
              import('@vet/non-formal-programs')
                .then(m => m.nonFormalProgramsRoutes),
          },
          // Long-term programs (authenticated)
          {
            path: 'long',
            canActivate: [authenticatedGuard],
            data: breadcrumb([]),
            loadChildren: () =>
              import('@vet/long-term-programs')
                .then(m => m.longTermProgramsRoutes),
          },
        ],
      },

      // =====================================
      // User Profile (Authenticated)
      // =====================================
      {
        path: 'user-profile',
        canActivate: [authenticatedGuard],
        data: breadcrumb([]),
        loadChildren: () =>
          import('@vet/user-profile')
            .then(m => m.userProfileRoutes),
      },

      // =====================================
      // Auth Routes (Unauthenticated)
      // =====================================
      {
        path: 'auth', // Changed from empty path to avoid collision with home
        canActivate: [unAuthenticatedGuard],
        data: breadcrumb([]),
        loadChildren: () =>
          import('@vet/auth').then(m => m.authRoutes),
      },

      // =====================================
      // Vacancy (Public/Mixed)
      // =====================================
      {
        path: 'vacancy',
        data: breadcrumb([]),
        loadChildren: () =>
          import('@vet/vacancy').then(m => m.vacancyRoutes),
      },

      // =====================================
      // Organisations (Public)
      // =====================================
      {
        path: 'organisations',
        data: breadcrumb([]),
        loadChildren: () =>
          import('@vet/organisations')
            .then(m => m.organisationsRoutes),
      },
    ],
  },
];
