import { Route } from '@angular/router';
import { PagesComponent } from './pages.component';
import { breadcrumb } from '@vet/shared';
import { useMatchedPageList } from './pages.signals';
import { toObservable } from '@angular/core/rxjs-interop';
import { map, of } from 'rxjs';
import { ArticlePageComponent } from './components/article-page/article-page.component';
import { usePageCollectionItem } from './pages.resources';
import { signal } from '@angular/core';

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
          (route, params) => {
            const state = history.state;
            if (state?.parentPageSlug && state?.parentPageTitle) {
              return of([
                {
                  path: `/pages/${state.parentPageSlug}`,
                  text: state.parentPageTitle,
                },
              ]);
            }
            return of([]);
          },
          (route, params) => {
            const articleId = params['id'];

            if (!articleId) {
              return of([]);
            }

            const itemId = signal(Number(articleId));
            const item = usePageCollectionItem(itemId);

            return toObservable(item.value).pipe(
              map((article) => {
                if (!article) {
                  return [];
                }
                return [
                  {
                    path: `/article/${article.id}`,
                    text: article.meta_title ?? '',
                  },
                ];
              }),
            );
          },
        ]),
      },
    ],
  },
];
