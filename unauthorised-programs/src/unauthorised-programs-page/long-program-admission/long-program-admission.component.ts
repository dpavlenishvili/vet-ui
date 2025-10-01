import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { TranslocoPipe } from '@jsverse/transloco';
import { KENDO_ICONS } from '@progress/kendo-angular-icons';
import { KENDO_TOOLTIP } from '@progress/kendo-angular-tooltip';
import { useIsUserLoaded, useUser } from '@vet/auth';
import { Admission, IdName } from '@vet/backend';
import { DividerComponent, kendoIcons, vetIcons } from '@vet/shared';
import { RegisteredCount } from 'programs-common/src/programs.types';

@Component({
  selector: 'vet-long-program-admission',
  imports: [KENDO_ICONS, KENDO_TOOLTIP, TranslocoPipe, DividerComponent],
  templateUrl: './long-program-admission.component.html',
  styleUrl: './long-program-admission.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LongProgramAdmissionComponent {
  user = useUser();
  isUserLoaded = useIsUserLoaded();
  admissions = input.required<Admission | undefined>();
  registeredCount = input<RegisteredCount | undefined>();
  educationLevel = input.required<IdName | undefined>();
  vetIcons = vetIcons;
  kendoIcons = kendoIcons;

  get financingTypeName(): string | undefined {
    const ft = this.admissions()?.financing_type;

    if (typeof ft === 'object' && ft !== null && 'name' in ft) {
      return (ft as { name: string }).name;
    }

    return undefined;
  }

  get educationLevelNumber(): number {
    return this.educationLevel() as number;
  }
}
