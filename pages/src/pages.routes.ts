import { Route } from '@angular/router';
import { PagesComponent } from './pages.component';
import { breadcrumb } from '@vet/shared';
import { useMatchedPageList } from './pages.signals';
import { toObservable } from '@angular/core/rxjs-interop';
import { map } from 'rxjs';
import { ArticlePageComponent } from './components/article-page/article-page.component';

export const pagesRoutes: Route[] = [
  {
    path: 'pages',
    loadComponent: () => import('./components/page-layout/page-layout.component').then((m) => m.PageLayoutComponent),
    children: [
      {
        path: '**',
        component: PagesComponent,
        data: breadcrumb([
          { path: '', text: 'shared.home' },
          () => {
            const matchedPages = useMatchedPageList();

            return toObservable(matchedPages).pipe(
              map((pages) => {
                console.log('breadcrumb', pages);
                return pages.map((page) => ({
                  path: `/pages/${page.slug}`,
                  text: page.title ?? '',
                }));
              }),
            );
          },
        ]),
      },
    ],
  },
  {
    path: 'article',
    loadComponent: () => import('./components/page-layout/page-layout.component').then((m) => m.PageLayoutComponent),
    children: [
      {
        path: ':id',
        component: ArticlePageComponent,
        data: breadcrumb([
          { path: '', text: 'shared.home' },
          () => {
            const matchedPages = useMatchedPageList();

            return toObservable(matchedPages).pipe(
              map((pages) =>
                pages.map((page) => ({
                  path: `/pages/${page.slug}`,
                  text: page.title ?? '',
                })),
              ),
            );
          },
        ]),
      },
    ],
  },
];
