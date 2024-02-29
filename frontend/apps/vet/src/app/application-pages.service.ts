import { computed, inject, Injectable, Signal, signal, Type } from '@angular/core';
import { from, map, MonoTypeOperatorFunction, Observable, tap } from 'rxjs';
import { Page, PagesService } from '@vet/backend';
import { Router, Routes } from '@angular/router';

type GroupedPages = Record<number, Page[]>;

const HeaderMenuId = 8 as const;
const FooterMenuId = 9 as const;

const PageTypeToPageComponent: Record<string, () => Promise<Type<unknown>>> = {
    collection: () =>
        import('./default-collection-page/default-collection-page.component').then(
            (m) => m.DefaultCollectionPageComponent,
        ),
    default_static: () =>
        import('./default-static-page/default-static-page.component').then((m) => m.DefaultStaticPageComponent),
};

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

    byMenuId(menuId: number): Signal<Page[]> {
        return computed(() => this.groupedPages()[menuId] || []);
    }

    configureRoutes(): Observable<Page[]> {
        if (this.dynamicPagesRoutes.length) {
            this._configureRoutes();
            return from([]);
        }
        return this.populate().pipe(tap(() => this._configureRoutes()));
    }

    populate(): Observable<Page[]> {
        return this.pagesService.getPagesList().pipe(
            map(({ data }) =>
                (data || []).sort((ap, bp) => {
                    const a = ap.position || 0;
                    const b = bp.position || 0;
                    return a - b;
                }),
            ),
            this.populateDynamicPagesRoutes(),
            this.populateGroupedPages(),
        );
    }

    private _configureRoutes(): void {
        const existingRoutes = [...this.router.config];
        const pagesIndex = existingRoutes.findIndex((route) => route.path === 'pages');
        existingRoutes[pagesIndex].children = [...this.dynamicPagesRoutes];
        this.router.resetConfig(existingRoutes);
    }

    private resolvePageComponent(page: Page): () => Promise<Type<unknown>> {
        const resolvedCmpLoader = PageTypeToPageComponent[page.type as string];
        if (resolvedCmpLoader) {
            return resolvedCmpLoader;
        }
        throw new Error(`No component for page type ${page.type}`);
    }

    private populateDynamicPagesRoutes(): MonoTypeOperatorFunction<Page[]> {
        return (source) =>
            source.pipe(
                tap((pages) => {
                    this.dynamicPagesRoutes = pages.map((page) => {
                        return {
                            path: page.slug,
                            loadComponent: this.resolvePageComponent(page),
                            title: page.title,
                            data: {
                                page, // This will be passed to the component as an @Input
                            },
                        };
                    });
                }),
            );
    }

    private populateGroupedPages(): MonoTypeOperatorFunction<Page[]> {
        return (source) =>
            source.pipe(
                tap((pages) => {
                    this.groupedPages.set(
                        pages.reduce((groupedByMenu: GroupedPages, _page: Page) => {
                            const page = {
                                ..._page,
                                slug: `/pages/${_page.slug}`,
                            };
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
                        }, {}) as GroupedPages,
                    );
                }),
            );
    }
}
