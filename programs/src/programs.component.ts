import { ChangeDetectionStrategy, Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
    selector: 'vet-programs',
    standalone: true,
    imports: [CommonModule],
    templateUrl: './programs.component.html',
    styleUrl: './programs.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class ProgramsComponent {
}
