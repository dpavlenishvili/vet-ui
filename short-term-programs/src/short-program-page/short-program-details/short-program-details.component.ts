import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { KENDO_ICONS } from '@progress/kendo-angular-icons';
import { kendoIcons, vetIcons } from '@vet/shared';
import { ShortProgramShow } from '@vet/backend';
import { TranslocoPipe } from '@jsverse/transloco';

@Component({
  selector: 'vet-short-program-details',
  imports: [KENDO_ICONS, TranslocoPipe],
  templateUrl: './short-program-details.component.html',
  styleUrl: './short-program-details.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
})
export class ShortProgramDetailsComponent {
  program = input.required<ShortProgramShow>();
  vetIcons = vetIcons;
  kendoIcons = kendoIcons;
}
