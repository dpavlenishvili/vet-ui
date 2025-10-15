import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { KENDO_ICONS } from '@progress/kendo-angular-icons';
import { LongTerm, NonFormalShow } from '@vet/backend';
import { vetIcons } from '@vet/shared';
import { Organisation, ProgramShow } from 'programs-common/src/programs.types';

@Component({
  selector: 'vet-program-contact-info',
  imports: [KENDO_ICONS],
  templateUrl: './program-contact-info.component.html',
  styleUrl: './program-contact-info.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProgramContactInfoComponent {
  program = input.required<ProgramShow | LongTerm | NonFormalShow | undefined>();
  vetIcons = vetIcons;

  get organisation() {
    return this.program()?.organisation as Organisation | undefined;
  }

  programAddress = computed(() => {
    const prog = this.program();
    if (!prog) return undefined;

    // NonFormalShow doesn't have direct address property, use organisation.address
    if ('isced' in prog) {
      return (prog as NonFormalShow).organisation?.address;
    }

    // ProgramShow and LongTerm have direct address property
    return (prog as ProgramShow | LongTerm).address;
  });
}
