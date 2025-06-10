import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { KENDO_ICONS } from '@progress/kendo-angular-icons';
import { vetIcons } from '@vet/shared';
import { TranslocoPipe } from '@jsverse/transloco';

@Component({
  selector: 'vet-short-program-isced-list',
  imports: [KENDO_ICONS, TranslocoPipe],
  templateUrl: './short-program-isced-list.component.html',
  styleUrl: './short-program-isced-list.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
})
export class ShortProgramISCEDListComponent {
  iscedList = input.required<string[] | null | undefined>();
  vetIcons = vetIcons;
}
