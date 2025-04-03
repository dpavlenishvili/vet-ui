import type { Routes } from '@angular/router';
import { dynamicUrlPrefix } from '@vet/dynamic-pages';
import { breadcrumb } from '@vet/shared';

import { programsRoutes } from '@vet/programs';
import { longTermProgramsRoutes } from '@vet/long-term-programs';
import { userProfileRoutes } from '@vet/user-profile';
import { authenticatedGuard, authRoutes, unAuthenticatedGuard } from '@vet/auth';
import { homeRoutes } from '@vet/home';
import { MainLayoutComponent } from './layouts/main-layout/main-layout.component';

export const appRoutes: Routes = [
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
        path: 'programs',
        children: programsRoutes,
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
        canActivate: [authenticatedGuard],
      },
      {
        path: '',
        children: authRoutes,
        data: breadcrumb([]),
        canActivate: [unAuthenticatedGuard],
      },
    ],
  },
  {
    path: dynamicUrlPrefix,
    component: MainLayoutComponent,
    children: [],
  },
];
