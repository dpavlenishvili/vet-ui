import { ChangeDetectionStrategy, Component } from '@angular/core';
import { AsyncPipe } from '@angular/common';
import { BreadCrumbModule } from '@progress/kendo-angular-navigation';
import { ActivatedRoute, ActivationEnd, NavigationEnd, Router, RouterLink } from '@angular/router';
import { filter, map, Observable, startWith } from 'rxjs';
import { AppBreadCrumbItem, ResolvedBreadCrumbItem } from '../../shared.types';
import { collectParams, getLastRoute } from '../../shared.utils';
import { TranslocoPipe } from '@jsverse/transloco';
import { TooltipModule } from '@progress/kendo-angular-tooltip';

@Component({
  selector: 'vet-breadcrumb',
  imports: [AsyncPipe, BreadCrumbModule, RouterLink, TranslocoPipe, TooltipModule],
  templateUrl: './breadcrumb.component.html',
  styleUrl: './breadcrumb.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BreadcrumbComponent {
  showTooltipTextSizeThreshold = 34;
  breadcrumbItems$: Observable<ResolvedBreadCrumbItem[]>;

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

        return items.map(
          (item) =>
            ({
              path: item['path']
                ?.split('/')
                .map((segment) => (segment.startsWith(':') ? (params[segment.slice(1)] ?? '') : segment)),
              text: typeof item['text'] === 'function' ? item['text'](this.activatedRoute.snapshot) : item['text'],
            }) as ResolvedBreadCrumbItem,
        );
      }),
    );
  }
}
