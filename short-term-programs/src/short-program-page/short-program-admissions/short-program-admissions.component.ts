import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { KENDO_ICONS } from '@progress/kendo-angular-icons';
import { kendoIcons, vetIcons } from '@vet/shared';
import { Admission } from '@vet/backend';
import { TranslocoPipe } from '@jsverse/transloco';

@Component({
  selector: 'vet-short-program-admissions',
  imports: [KENDO_ICONS, TranslocoPipe],
  templateUrl: './short-program-admissions.component.html',
  styleUrl: './short-program-admissions.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
})
export class ShortProgramAdmissionsComponent {
  admissions = input.required<Admission[] | undefined>();
  vetIcons = vetIcons;
  kendoIcons = kendoIcons;
}
