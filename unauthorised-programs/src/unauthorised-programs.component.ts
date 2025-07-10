import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { UnauthorisedProgramsGridComponent } from './unauthorised-programs-grid/unauthorised-programs-grid.component';
import { ProgramsService } from '@vet/backend';
import { ActivatedRoute, Router } from '@angular/router';
import { useFilters, useFiltersUpdater, usePage, usePageUpdater } from '@vet/shared';
import { TranslocoPipe } from '@jsverse/transloco';
import { ProgramFilters } from '@vet/programs-common';
import { UnAuthorisedProgramsFiltersComponent } from './unauthorised-programs-filters/unauthorised-programs-filters.component';
import { useUnauthorizedUserPrograms } from './unauthorised-programs.resources';

@Component({
  selector: 'vet-unauthorised-programs',
  imports: [UnauthorisedProgramsGridComponent, UnAuthorisedProgramsFiltersComponent, TranslocoPipe],
  templateUrl: './unauthorised-programs.component.html',
  styleUrl: './unauthorised-programs.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UnauthorisedProgramsComponent {
  programsService = inject(ProgramsService);
  router = inject(Router);
  activatedRoute = inject(ActivatedRoute);
  filters = useFilters<ProgramFilters>();
  page = usePage();
  updateFilters = useFiltersUpdater<ProgramFilters>();
  updatePage = usePageUpdater();
  data = useUnauthorizedUserPrograms();

  onFiltersChange(filters: ProgramFilters) {
    this.updateFilters(filters);
  }

  onPageChange(page: number) {
    this.updatePage(page);
  }
}
