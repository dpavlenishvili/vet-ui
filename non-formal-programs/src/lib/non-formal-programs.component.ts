import { ChangeDetectionStrategy, Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'vet-non-formal-programs',
  imports: [CommonModule],
  templateUrl: './non-formal-programs.component.html',
  styleUrl: './non-formal-programs.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NonFormalProgramsComponent {}
