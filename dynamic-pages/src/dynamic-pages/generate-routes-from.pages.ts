import type { Route, Routes } from '@angular/router';

import type { ApplicationPage } from './application.page.type';
import { resolvePageComponent } from './resolve-page.component';
import { breadcrumb } from '@vet/shared';

export function generateRoutesFromPages(pages: ApplicationPage[], routes: Routes = []): Routes {
  pages.forEach((page) => {
    if (page.children && page.children.length > 0) {
      generateRoutesFromPages(page.children, routes);
    }
    const [, ...url] = page.url;
    const path = url.join('/');

    const children: Routes = [
      {
        path: '',
        loadComponent: resolvePageComponent(page),
        title: page.title,
        data: {
          page, // This will be passed to the component as an input
          ...breadcrumb([
            { path: '', text: 'shared.home' },
            { path: path, text: page.title ?? '' },
          ])
        },
      },
    ];
    const route: Route = {
      path,
      children,
      data: breadcrumb([
        { path: '', text: 'shared.home' },
        { path: path, text: page.title ?? '' },
      ]),
    };

    if (page.type === 'collection') {
      children.push({
        path: ':itemSlug',
        loadComponent: () =>
          import('../collection/collection-item-page/collection-item-page.component').then(
            (m) => m.CollectionItemPageComponent,
          ),
        data: {
          page,
          ...breadcrumb([
            { path: '', text: 'shared.home' },
            { path: path, text: page.title ?? '' },
          ])
        },
      });
    }
    routes.push(route);
  });
  return routes;
}
