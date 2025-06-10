import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { vetIcons } from '@vet/shared';

@Component({
  selector: 'vet-short-program-section',
  imports: [],
  templateUrl: './short-program-section.component.html',
  styleUrl: './short-program-section.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
})
export class ShortProgramSectionComponent {
  title = input.required<string>();
  vetIcons = vetIcons;
}
