import { Routes } from '@angular/router';
import { dynamicUrlPrefix } from '@vet/dynamic-pages';
import { breadcrumb } from '@vet/shared';

import { MainLayoutComponent } from './main-layout.component';

export const appRoutes: Routes = [
  {
    path: '',
    component: MainLayoutComponent,
    children: [
      {
        // Temporary redirect to registration page
        path: '',
        redirectTo: 'home',
        pathMatch: 'full',
      },
      {
        path: 'home',
        loadChildren: () => import('@vet/home').then((r) => r.homeRoutes),
      },
      {
        path: 'programs',
        loadChildren: () => import('@vet/programs').then((r) => r.programsRoutes),
        data: breadcrumb([]),
      },
      {
        path: '',
        loadChildren: () => import('@vet/auth').then((r) => r.authRoutes),
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
