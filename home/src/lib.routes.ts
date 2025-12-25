import type { Route } from '@angular/router';

import { HomeComponent } from './home.component';

export const homeRoutes: Route[] = [
  {
    path: '',
    pathMatch: 'full',
    data: { isHome: true },
    component: HomeComponent,
  },
];
