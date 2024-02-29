import { computed, inject, Injectable, Signal, signal, Type } from '@angular/core';
import { from, map, MonoTypeOperatorFunction, Observable, tap } from 'rxjs';
import { Page, PagesService } from '@vet/backend';
import { Router, Routes } from '@angular/router';

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

function resolvePageComponent(page: Page): () => Promise<Type<unknown>> {
    const resolvedCmpLoader = PageTypeToPageComponent[page.type as string];
    if (resolvedCmpLoader) {
        return resolvedCmpLoader;
    }
    throw new Error(`No component for page type ${page.type}`);
}

function generateRoutesFromPages(pages: ApplicationPage[], routes: Routes = []): Routes {
    pages.forEach((page) => {
        if (page.children && page.children.length > 0) {
            generateRoutesFromPages(page.children, routes);
        }
        const [, ...url] = page.url;
        routes.push({
            path: url.join('/'),
            loadComponent: resolvePageComponent(page),
            title: page.title,
            data: {
                page, // This will be passed to the component as an @Input
            },
        });
    });
    return routes;
}

const dynamicUrlPrefix = 'pages';

function addUrlPrefixToPage(page: Page): ApplicationPage {
    return {
        ...page,
        url: [dynamicUrlPrefix, ...(page.slug || '').split('/')],
        children: (page.children || []).map(addUrlPrefixToPage),
    };
}

export type ApplicationPage = Page & { url: string[]; children?: ApplicationPage[] };
type GroupedPages = Record<number, ApplicationPage[]>;

function filterByMenuId(pages: ApplicationPage[], menuId: number): ApplicationPage[] {
    return pages.reduce((acc: ApplicationPage[], page) => {
        if (page.menus && page.menus.some((menu) => menu.id === menuId)) {
            acc.push({ ...page, children: filterByMenuId(page.children || [], menuId) });
        }
        return acc;
    }, []);
}

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
