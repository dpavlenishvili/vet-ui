import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { KENDO_ICONS } from '@progress/kendo-angular-icons';
import { vetIcons } from '@vet/shared';
import { ShortProgramShow } from '@vet/backend';
import { TranslocoPipe } from '@jsverse/transloco';

@Component({
  selector: 'vet-short-program-contact-info',
  imports: [KENDO_ICONS, TranslocoPipe],
  templateUrl: './short-program-contact-info.component.html',
  styleUrl: './short-program-contact-info.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
})
export class ShortProgramContactInfoComponent {
  program = input.required<ShortProgramShow>();
  vetIcons = vetIcons;
}
