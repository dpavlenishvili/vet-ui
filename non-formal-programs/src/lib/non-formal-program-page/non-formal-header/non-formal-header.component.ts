import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { vetIcons } from '@vet/shared';
import { NonFormalShow } from '@vet/backend';

@Component({
  selector: 'vet-non-formal-header',
  standalone: true,
  imports: [],
  templateUrl: './non-formal-header.component.html',
  styleUrl: './non-formal-header.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NonFormalHeaderComponent {
  program = input.required<NonFormalShow>();
  vetIcons = vetIcons;
}
