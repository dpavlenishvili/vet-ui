import { unauthorisedProgramsRoutes } from '@vet/unauthorised-programs';
import type { Routes } from '@angular/router';
import { dynamicUrlPrefix } from '@vet/dynamic-pages';
import { breadcrumb } from '@vet/shared';

import { longTermProgramsRoutes } from '@vet/long-term-programs';
import { userProfileRoutes } from '@vet/user-profile';
import { authenticatedGuard, authRoutes, unAuthenticatedGuard } from '@vet/auth';
import { homeRoutes } from '@vet/home';
import { MainLayoutComponent } from './layouts/main-layout/main-layout.component';
import { shortTermProgramsRoutes } from '@vet/short-term-programs';
import { vacancyRoutes } from '@vet/vacancy';
import { dashboardRoutes } from '@vet/dashboard';

export const appRoutes: Routes = [
  {
    path: 'dashboard',
    children: dashboardRoutes,
    data: breadcrumb([]),
    canActivate: [],
  },
  {
    path: '',
    component: MainLayoutComponent,
    children: [
      {
        path: '',
        pathMatch: 'full',
        children: homeRoutes,
      },
      {
        path: 'programs/short',
        children: shortTermProgramsRoutes,
        data: breadcrumb([]),
        canActivate: [],
      },
      {
        path: 'programs',
        children: unauthorisedProgramsRoutes,
        data: breadcrumb([]),
        canActivate: [unAuthenticatedGuard],
      },
      {
        path: 'long-term-programs',
        children: longTermProgramsRoutes,
        data: breadcrumb([]),
        canActivate: [authenticatedGuard],
      },
      {
        path: 'user-profile',
        children: userProfileRoutes,
        data: breadcrumb([]),
        canActivate: [],
      },
      {
        path: '',
        children: authRoutes,
        data: breadcrumb([]),
        canActivate: [unAuthenticatedGuard],
      },

      {
        path: 'vacancy',
        children: vacancyRoutes,
        data: breadcrumb([]),
      },
    ],
  },
  {
    path: dynamicUrlPrefix,
    component: MainLayoutComponent,
    children: [],
  },
];
