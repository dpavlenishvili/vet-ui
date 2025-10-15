import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { UnauthorisedProgramsGridComponent } from './unauthorised-programs-grid/unauthorised-programs-grid.component';
import { ActivatedRoute, Router } from '@angular/router';
import { useFilters, useFiltersUpdater } from '@vet/shared';
import { ProgramFilters } from '@vet/programs-common';
import { UnAuthorisedProgramsFiltersComponent } from './unauthorised-programs-filters/unauthorised-programs-filters.component';

@Component({
  selector: 'vet-unauthorised-programs',
  imports: [UnauthorisedProgramsGridComponent, UnAuthorisedProgramsFiltersComponent],
  templateUrl: './unauthorised-programs.component.html',
  styleUrl: './unauthorised-programs.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UnauthorisedProgramsComponent {
  router = inject(Router);
  activatedRoute = inject(ActivatedRoute);
  filters = useFilters<ProgramFilters>();
  updateFilters = useFiltersUpdater<ProgramFilters>();

  onFiltersChange(filters: ProgramFilters) {
    this.updateFilters(filters);
  }
}
