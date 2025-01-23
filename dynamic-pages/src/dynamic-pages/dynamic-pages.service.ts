import { computed, inject, Injectable, type Signal, signal } from '@angular/core';
import { Router, type Routes } from '@angular/router';
import { from, map, type MonoTypeOperatorFunction, Observable, tap } from 'rxjs';

import { addUrlPrefixToPage } from './add-url-prefix-to.page';
import type { ApplicationPage, GroupedPages } from './application.page.type';
import { dynamicUrlPrefix } from './dynamic-url.prefix';
import { filterByMenuId } from './filter-by-menu.id';
import { generateRoutesFromPages } from './generate-routes-from.pages';
import { PagesService } from '@vet/backend';

const HeaderMenuId = 8 as const;
const FooterMenuId = 9 as const;

@Injectable({
  providedIn: 'root',
})
export class ApplicationPagesService {
  headerMenuPages$ = this.byMenuId(HeaderMenuId);
  footerMenuPages$ = this.byMenuId(FooterMenuId);

  private pagesService = inject(PagesService);
  private router = inject(Router);
  private groupedPages = signal<GroupedPages>({});
  private dynamicPagesRoutes: Routes = [];

  byMenuId(menuId: number): Signal<ApplicationPage[]> {
    return computed(() => {
      const items = this.groupedPages()[menuId] || [];
      if (items.length > 0) {
        return filterByMenuId(items, menuId);
      }
      return items;
    });
  }

  configureRoutes(): Observable<ApplicationPage[]> {
    if (this.dynamicPagesRoutes.length) {
      this._configureRoutes();
      return from([]);
    }
    return this.populate().pipe(tap(() => this._configureRoutes()));
  }

  populate(): Observable<ApplicationPage[]> {
    return this.pagesService.getPagesList().pipe(
      map(({ data }) =>
        (data || []).sort((ap, bp) => {
          const a = ap.position || 0;
          const b = bp.position || 0;
          return a - b;
        }),
      ),
      map((pages) => pages.map(addUrlPrefixToPage)),
      tap((pages) => (this.dynamicPagesRoutes = generateRoutesFromPages(pages))),
      this.populateGroupedPages(),
    );
  }

  private _configureRoutes(): void {
    const existingRoutes = [...this.router.config];
    const pagesIndex = existingRoutes.findIndex((route) => route.path === dynamicUrlPrefix);
    existingRoutes[pagesIndex].children = [...this.dynamicPagesRoutes];
    console.log({ existingRoutes });
    this.router.resetConfig(existingRoutes);
  }

  private populateGroupedPages(): MonoTypeOperatorFunction<ApplicationPage[]> {
    return (source) =>
      source.pipe(
        tap((pages) => {
          const groupedPages = pages.reduce((groupedByMenu: GroupedPages, page: ApplicationPage) => {
            if (page.menus) {
              page.menus.forEach((menu) => {
                groupedByMenu[menu.id] = groupedByMenu[menu.id] || [];
                groupedByMenu[menu.id].push(page);
              });
            } else {
              groupedByMenu[-1] = groupedByMenu[-1] || [];
              groupedByMenu[-1].push(page);
            }
            return groupedByMenu;
          }, {});
          this.groupedPages.set(groupedPages);
        }),
      );
  }
}
