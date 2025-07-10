import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { vetIcons } from '@vet/shared';

@Component({
  selector: 'vet-program-section',
  imports: [],
  templateUrl: './program-section.component.html',
  styleUrl: './program-section.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
})
export class ProgramSectionComponent {
  title = input.required<string>();
  vetIcons = vetIcons;
}
