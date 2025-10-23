import { ChangeDetectionStrategy, Component, inject, Injector, runInInjectionContext } from '@angular/core';
import { AsyncPipe } from '@angular/common';
import { BreadCrumbModule } from '@progress/kendo-angular-navigation';
import { ActivatedRoute, ActivationEnd, NavigationEnd, Params, Router, RouterLink } from '@angular/router';
import { combineLatest, filter, map, Observable, of, startWith, switchMap } from 'rxjs';
import type { AppBreadCrumbItem, AppBreadCrumbItemObject, ResolvedBreadCrumbItem } from '../../shared.types';
import { collectParams, getLastRoute } from '../../shared.utils';
import { TranslocoPipe } from '@jsverse/transloco';
import { TooltipModule } from '@progress/kendo-angular-tooltip';
import * as kendoIcons from '@progress/kendo-svg-icons';

@Component({
  selector: 'vet-breadcrumb',
  imports: [AsyncPipe, BreadCrumbModule, RouterLink, TranslocoPipe, TooltipModule],
  templateUrl: './breadcrumb.component.html',
  styleUrl: './breadcrumb.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
})
export class BreadcrumbComponent {
  injector = inject(Injector);
  showTooltipTextSizeThreshold = 34;
  breadcrumbItems$: Observable<ResolvedBreadCrumbItem[]>;
  kendoIcons = kendoIcons;

  constructor(
    private activatedRoute: ActivatedRoute,
    private router: Router,
  ) {
    this.breadcrumbItems$ = this.router.events.pipe(
      filter((event) => event instanceof ActivationEnd || event instanceof NavigationEnd),
      startWith(null),
      map(() => {
        if (this.router.url === '/' || this.router.url.startsWith('/?')) {
          return [];
        }
        return getLastRoute(this.activatedRoute).snapshot.data?.['breadcrumb'] ?? [];
      }),
      switchMap((items: Array<AppBreadCrumbItem>) => {
        if (items.length === 0) {
          return of([]);
        }

        const params = collectParams(this.activatedRoute);
        return runInInjectionContext(this.injector, () => {
          const observables = items.flatMap((item) => {
            if (typeof item === 'function') {
              return item(this.activatedRoute.snapshot, params).pipe(
                map((items) => items.map((obj) => this.resolveBreadcrumbItem(obj, params))),
              );
            }
            return of([this.resolveBreadcrumbItem(item, params)]);
          });
          return combineLatest(observables).pipe(map((arrays) => arrays.flat()));
        });
      }),
    );
  }

  private resolveBreadcrumbItem(item: AppBreadCrumbItemObject, params: Params) {
    const path = typeof item['path'] === 'function'
      ? item['path'](this.activatedRoute.snapshot, params)
      : item['path'];

    const text = typeof item['text'] === 'function'
      ? item['text'](this.activatedRoute.snapshot, params)
      : item['text'];

    return {
      path: path
        ?.split('/')
        .map((segment) => (segment.startsWith(':') ? (params[segment.slice(1)] ?? '') : segment)),
      text,
    } as ResolvedBreadCrumbItem;
  }
}
