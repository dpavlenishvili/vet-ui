import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { NonFormalProgramsFiltersComponent } from './non-formal-programs-filters/non-formal-programs-filters.component';
import { NonFormalProgramsGridComponent } from './non-formal-programs-grid/non-formal-programs-grid.component';
import { ActivatedRoute, Router } from '@angular/router';
import { useFilters, useFiltersUpdater } from '@vet/shared/utils';
import { NonFormalProgramFilters } from './non-formal-programs.types';

@Component({
  selector: 'vet-non-formal-programs',
  imports: [NonFormalProgramsGridComponent, NonFormalProgramsFiltersComponent],
  templateUrl: './non-formal-programs.component.html',
  styleUrl: './non-formal-programs.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
})
export class NonFormalProgramsComponent {
  router = inject(Router);
  activatedRoute = inject(ActivatedRoute);
  filters = useFilters<NonFormalProgramFilters>();
  updateFilters = useFiltersUpdater<NonFormalProgramFilters>();

  onFiltersChange(filters: NonFormalProgramFilters) {
    this.updateFilters(filters);
  }
}
