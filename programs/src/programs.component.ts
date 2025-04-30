import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { ProgramsFiltersComponent } from './programs-filters/programs-filters.component';
import { ProgramsListComponent } from './programs-list/programs-list.component';
import { ProgramsService } from '@vet/backend';
import { rxResource } from '@angular/core/rxjs-interop';

export type ProgramFilters = {
  program: string | null;
  organisation_id: string | null;
  program_name: string | null;
  form: string | null;
  duration: string | null;
  integrated: string | null;
};

@Component({
  selector: 'vet-programs',
  imports: [ProgramsFiltersComponent, ProgramsListComponent],
  templateUrl: './programs.component.html',
  styleUrl: './programs.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
})
export class ProgramsComponent {
  private programsService = inject(ProgramsService);

  filters = signal<Partial<ProgramFilters>>({});

  programs$ = rxResource({
    request: () => this.filters(),
    loader: (filters) => {
      return this.programsService.programs({ filter: filters });
    },
  });

  onFiltersChange(filters: Partial<ProgramFilters>) {
    const cleanedFilters = Object.fromEntries(
      Object.entries(filters).filter(([_, value]) => value !== null && value !== ''),
    );

    this.filters.set(cleanedFilters);
  }
}
