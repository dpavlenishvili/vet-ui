import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { KENDO_ICONS } from '@progress/kendo-angular-icons';
import { FormatDatePipe, kendoIcons, vetIcons } from '@vet/shared';
import { Admission } from '@vet/backend';
import { TranslocoPipe } from '@jsverse/transloco';
import { useIsUserLoaded, useUser } from '@vet/auth';

@Component({
  selector: 'vet-short-program-admissions',
  imports: [KENDO_ICONS, TranslocoPipe, FormatDatePipe],
  templateUrl: './short-program-admissions.component.html',
  styleUrl: './short-program-admissions.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
})
export class ShortProgramAdmissionsComponent {
  user = useUser();
  isUserLoaded = useIsUserLoaded();
  admissions = input.required<Admission[] | undefined>();
  vetIcons = vetIcons;
  kendoIcons = kendoIcons;
}
