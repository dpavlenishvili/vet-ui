import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { SVGIconComponent } from '@progress/kendo-angular-icons';
import { vetIcons } from '@vet/shared';
import { NonFormalShow } from '@vet/backend';

@Component({
  selector: 'vet-non-formal-contact',
  standalone: true,
  imports: [SVGIconComponent],
  templateUrl: './non-formal-contact.component.html',
  styleUrl: './non-formal-contact.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NonFormalContactComponent {
  program = input.required<NonFormalShow>();
  vetIcons = vetIcons;
}
