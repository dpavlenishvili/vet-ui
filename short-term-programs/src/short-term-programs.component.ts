import { ChangeDetectionStrategy, Component, computed, effect, inject, signal } from '@angular/core';
import { ShortTermProgramsGridComponent } from './short-term-programs-grid/short-term-programs-grid.component';
import {
  ShortTermProgramFilters,
  ShortTermProgramsFiltersComponent
} from './short-term-programs-filters/short-term-programs-filters.component';
import { ProgramsService } from '@vet/backend';
import { rxResource } from '@angular/core/rxjs-interop';
import {
  FilterOptionsMap,
  toFilterOptionsMap,
  useFilters,
  useFiltersUpdater,
} from '@vet/shared';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'vet-short-term-programs',
  imports: [ShortTermProgramsGridComponent, ShortTermProgramsFiltersComponent],
  templateUrl: './short-term-programs.component.html',
  styleUrl: './short-term-programs.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
})
export class ShortTermProgramsComponent {
  shortProgramsService = inject(ProgramsService);
  router = inject(Router);
  activatedRoute = inject(ActivatedRoute);
  filterOptionsMap = signal<FilterOptionsMap>(new Map());
  filters = useFilters<ShortTermProgramFilters>();
  updateFilters = useFiltersUpdater<ShortTermProgramFilters>();
  data = rxResource({
    request: () => this.filters(),
    loader: ({ request }) =>
      this.shortProgramsService.programsShort({
        filter: JSON.stringify(request),
      }),
  });
  programs = computed(() => this.data.value()?.data ?? []);

  constructor() {
    effect(() => {
      if (this.data.hasValue()) {
        const filters = this.data.value()?.filters;

        if (filters) {
          this.filterOptionsMap.set(toFilterOptionsMap(filters));
        }
      }
    });
  }

  onFiltersChange(filters: ShortTermProgramFilters) {
    this.updateFilters(filters);
  }
}
