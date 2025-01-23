import type { Route, Routes } from '@angular/router';

import type { ApplicationPage } from './application.page.type';
import { resolvePageComponent } from './resolve-page.component';

export function generateRoutesFromPages(pages: ApplicationPage[], routes: Routes = []): Routes {
  pages.forEach((page) => {
    if (page.children && page.children.length > 0) {
      generateRoutesFromPages(page.children, routes);
    }
    const [, ...url] = page.url;

    const children: Routes = [
      {
        path: '',
        loadComponent: resolvePageComponent(page),
        title: page.title,
        data: {
          page, // This will be passed to the component as an input
        },
      },
    ];
    const route: Route = {
      path: url.join('/'),
      children,
    };

    if (page.type === 'collection') {
      children.push({
        path: ':itemSlug',
        loadComponent: () =>
          import('../collection/collection-item-page/collection-item-page.component').then(
            (m) => m.CollectionItemPageComponent,
          ),
        data: { page },
      });
    }
    routes.push(route);
  });
  return routes;
}
