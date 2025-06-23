import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { ShortTermProgramsGridComponent } from './short-term-programs-grid/short-term-programs-grid.component';
import { ShortTermProgramsFiltersComponent } from './short-term-programs-filters/short-term-programs-filters.component';
import { ProgramsService } from '@vet/backend';
import { rxResource } from '@angular/core/rxjs-interop';
import {
  flattenQueryParams,
  PaginatedGridResult,
  useFilters,
  useFiltersUpdater,
  usePage,
  usePageUpdater,
} from '@vet/shared';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslocoPipe } from '@jsverse/transloco';
import { ShortTermProgramFilters } from './short-term-programs.types';
import { map, of } from 'rxjs';

@Component({
  selector: 'vet-short-term-programs',
  imports: [ShortTermProgramsGridComponent, ShortTermProgramsFiltersComponent, TranslocoPipe],
  templateUrl: './short-term-programs.component.html',
  styleUrl: './short-term-programs.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
})
export class ShortTermProgramsComponent {
  shortProgramsService = inject(ProgramsService);
  router = inject(Router);
  activatedRoute = inject(ActivatedRoute);
  filters = useFilters<ShortTermProgramFilters>();
  page = usePage();
  realtimeFilters = signal<ShortTermProgramFilters>({});
  updateFilters = useFiltersUpdater<ShortTermProgramFilters>();
  updatePage = usePageUpdater();
  data = rxResource({
    request: () => ({
      filters: this.filters(),
      page: this.page(),
    }),
    defaultValue: {
      data: [],
      total: 0,
      size: 0,
      skip: 0,
    },
    loader: ({ request }) =>
      this.shortProgramsService
        .programsShort({
          page: request.page.toString(),
          ...flattenQueryParams(request.filters, 'filters'),
        } as any)
        .pipe(
          map(
            (response) =>
              ({
                data: response.data ?? [],
                total: response.meta?.total ?? response.data?.length ?? 0,
                size: response.meta?.per_page ?? response.data?.length ?? 0,
                skip: response.meta?.from ? response.meta.from - 1 : 0,
              }) as PaginatedGridResult,
          ),
        ),
  });
  foundProgramsCount = rxResource<number | null, ShortTermProgramFilters>({
    request: () => this.realtimeFilters(),
    defaultValue: null,
    loader: ({ request }) => {
      if (Object.keys(request).length === 0) {
        return of(0);
      }

      return this.shortProgramsService
        .programsShort(flattenQueryParams(request, 'filters'))
        .pipe(map((response) => response.meta?.total ?? 0));
    },
  });

  onFiltersChange(filters: ShortTermProgramFilters) {
    this.updateFilters(filters);
  }

  onPageChange(page: number) {
    this.updatePage(page);
  }

  onDialogFiltersChangeRealtime(filters: ShortTermProgramFilters) {
    this.realtimeFilters.set(filters);
  }
}
