import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { KENDO_ICONS } from '@progress/kendo-angular-icons';
import { kendoIcons, TransPipe, vetIcons } from '@vet/shared';
import { LongTerm, ShortProgramShow } from '@vet/backend';
import { ProgramDetailItem } from '@vet/programs-common';

@Component({
  selector: 'vet-program-details',
  imports: [KENDO_ICONS, TransPipe],
  templateUrl: './program-details.component.html',
  styleUrl: './program-details.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
})
export class ProgramDetailsComponent {
  program = input.required<ShortProgramShow | LongTerm | undefined>();
  items = input<ProgramDetailItem[]>([]);
  vetIcons = vetIcons;
  kendoIcons = kendoIcons;
}
