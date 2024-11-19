import { Routes } from '@angular/router';

import { dynamicUrlPrefix } from '@vet/dynamic-pages';
import { homeRoutes } from '@vet/home';

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
        children: homeRoutes,
      },
    ],
  },
  {
    path: dynamicUrlPrefix,
    component: MainLayoutComponent,
    children: [],
  },
];
