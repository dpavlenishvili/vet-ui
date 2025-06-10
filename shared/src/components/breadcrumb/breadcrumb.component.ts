import { ChangeDetectionStrategy, Component, inject, Injector, runInInjectionContext } from '@angular/core';
import { AsyncPipe } from '@angular/common';
import { BreadCrumbModule } from '@progress/kendo-angular-navigation';
import { ActivatedRoute, ActivationEnd, NavigationEnd, Router, RouterLink } from '@angular/router';
import { filter, map, Observable, startWith } from 'rxjs';
import type { AppBreadCrumbItem, ResolvedBreadCrumbItem } from '../../shared.types';
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
      map(() => getLastRoute(this.activatedRoute).snapshot.data?.['breadcrumb'] ?? []),
      map((items: Array<AppBreadCrumbItem>) => {
        const params = collectParams(this.activatedRoute);

        return runInInjectionContext(this.injector, () => {
          return items.map((item) => {
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
          });
        });
      }),
    );
  }
}
