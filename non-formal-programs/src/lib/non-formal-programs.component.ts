import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { NonFormalProgramsFiltersComponent } from './non-formal-programs-filters/non-formal-programs-filters.component';
import { NonFormalProgramsGridComponent } from './non-formal-programs-grid/non-formal-programs-grid.component';
import { ActivatedRoute, Router } from '@angular/router';
import { useFilters, useFiltersUpdater, usePage, usePageUpdater } from '@vet/shared';
import { ProgramFilters } from '@vet/programs-common';
import { useNonFormalPrograms } from './non-formal.resources';
import { LoaderComponent } from '@progress/kendo-angular-indicators';
import { TranslocoPipe } from '@jsverse/transloco';
import { NonFormalProgramFilters } from './non-formal-programs.types';

@Component({
  selector: 'vet-non-formal-programs',
  imports: [NonFormalProgramsGridComponent, NonFormalProgramsFiltersComponent, LoaderComponent, TranslocoPipe],
  templateUrl: './non-formal-programs.component.html',
  styleUrl: './non-formal-programs.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
})
export class NonFormalProgramsComponent {
  router = inject(Router);
  activatedRoute = inject(ActivatedRoute);
  filters = useFilters<NonFormalProgramFilters>();
  page = usePage();
  updateFilters = useFiltersUpdater<NonFormalProgramFilters>();
  updatePage = usePageUpdater();
  data = useNonFormalPrograms();

  onFiltersChange(filters: NonFormalProgramFilters) {
    this.updateFilters(filters);
  }

  onPageChange(page: number) {
    this.updatePage(page);
  }
}
