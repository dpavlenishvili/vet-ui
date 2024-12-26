import { ChangeDetectionStrategy, Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProgramsFiltersComponent } from './programs-filters/programs-filters.component';
import { ProgramsListComponent } from './programs-list/programs-list.component';

@Component({
    selector: 'vet-programs',
    standalone: true,
    imports: [CommonModule, ProgramsFiltersComponent, ProgramsListComponent],
    templateUrl: './programs.component.html',
    styleUrl: './programs.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class ProgramsComponent {
}
