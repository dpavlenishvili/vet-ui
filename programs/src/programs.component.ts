import { ChangeDetectionStrategy, Component } from '@angular/core';
import { ProgramsFiltersComponent } from './programs-filters/programs-filters.component';
import { ProgramsListComponent } from './programs-list/programs-list.component';
import { Observable } from 'rxjs';
import { ProgramsService } from '@vet/backend';
import { AsyncPipe } from '@angular/common';

@Component({
  selector: 'vet-programs',
  imports: [ProgramsFiltersComponent, ProgramsListComponent, AsyncPipe],
  templateUrl: './programs.component.html',
  styleUrl: './programs.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
})
export class ProgramsComponent {
  programs$: Observable<any>;

  constructor(private programsService: ProgramsService) {
    this.programs$ = programsService.programs();
  }

  onFiltersChange(
    filters: Partial<{
      program: string | null;
      organisation_id: string | null;
      program_name: string | null;
      form: string | null;
      duration: string | null;
      integrated: string | null;
    }>,
  ) {
    const params = Object.fromEntries(
      Object.entries(filters).filter(([_, value]) => value !== null && value !== '')
    );

    console.log(params)
  }
}
