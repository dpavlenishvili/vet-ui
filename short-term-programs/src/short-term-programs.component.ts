import { ShortTermProgramsFiltersComponent } from './short-term-programs-filters/short-term-programs-filters.component';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { useFilters, useFiltersUpdater, usePage, usePageUpdater } from '@vet/shared';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslocoPipe } from '@jsverse/transloco';
import { ShortTermProgramsGridComponent } from './short-term-programs-grid/short-term-programs-grid.component';
import { useShortTermPrograms } from './short-term.resources';
import { ShortTermProgramFilters } from './short-term-programs.types';

@Component({
  selector: 'vet-short-term-programs',
  imports: [ShortTermProgramsGridComponent, ShortTermProgramsFiltersComponent, TranslocoPipe],
  templateUrl: './short-term-programs.component.html',
  styleUrl: './short-term-programs.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
})
export class ShortTermProgramsComponent {
  router = inject(Router);
  activatedRoute = inject(ActivatedRoute);
  filters = useFilters<ShortTermProgramFilters>();
  page = usePage();
  updateFilters = useFiltersUpdater<ShortTermProgramFilters>();
  updatePage = usePageUpdater();
  data = useShortTermPrograms();

  onFiltersChange(filters: ShortTermProgramFilters) {
    this.updateFilters(filters);
  }

  onPageChange(page: number) {
    this.updatePage(page);
  }
}
