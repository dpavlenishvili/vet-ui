import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { ShortTermProgramsGridComponent } from './short-term-programs-grid/short-term-programs-grid.component';
import {
  ShortTermProgramFilters,
  ShortTermProgramsFiltersComponent,
} from './short-term-programs-filters/short-term-programs-filters.component';
import { ProgramsService } from '@vet/backend';
import { rxResource } from '@angular/core/rxjs-interop';
import { flattenQueryParams, useFilters, useFiltersUpdater } from '@vet/shared';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslocoPipe } from '@jsverse/transloco';

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
  updateFilters = useFiltersUpdater<ShortTermProgramFilters>();
  data = rxResource({
    request: () => this.filters(),
    loader: ({ request }) => this.shortProgramsService.programsShort(flattenQueryParams(request, 'filters')),
  });
  programs = computed(() => this.data.value()?.data ?? []);

  onFiltersChange(filters: ShortTermProgramFilters) {
    this.updateFilters(filters);
  }
}
