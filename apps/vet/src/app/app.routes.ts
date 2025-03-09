import type { Routes } from '@angular/router';
import { dynamicUrlPrefix } from '@vet/dynamic-pages';
import { breadcrumb } from '@vet/shared';

import { MainLayoutComponent } from './main-layout.component';
import { programsRoutes } from '@vet/programs';
import { longTermProgramsRoutes } from '@vet/long-term-programs';
import { HomeLayoutComponent } from './home-layout.component';
import { userProfileRoutes } from '@vet/user-profile';
import {authenticatedGuard, authRoutes} from '@vet/auth';

export const appRoutes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    component: HomeLayoutComponent,
    loadChildren: () => import('@vet/home').then((r) => r.homeRoutes),
  },
  {
    path: '',
    component: MainLayoutComponent,
    children: [
      {
        path: 'programs',
        children: programsRoutes,
        data: breadcrumb([]),
      },
      {
        path: 'long-term-programs',
        children: longTermProgramsRoutes,
        data: breadcrumb([]),
      },
      {
        path: 'user-profile',
        children: userProfileRoutes,
        canActivate: [authenticatedGuard]
      },
      {
        path: '',
        children: authRoutes,
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
