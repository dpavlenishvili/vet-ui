import { ChangeDetectionStrategy, Component } from '@angular/core';
import { ProgramsFiltersComponent } from './programs-filters/programs-filters.component';
import { ProgramsListComponent } from './programs-list/programs-list.component';

@Component({
  selector: 'vet-programs',
  imports: [ProgramsFiltersComponent, ProgramsListComponent],
  templateUrl: './programs.component.html',
  styleUrl: './programs.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true
})
export class ProgramsComponent {}
