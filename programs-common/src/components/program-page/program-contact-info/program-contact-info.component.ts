import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { KENDO_ICONS } from '@progress/kendo-angular-icons';
import { LongTerm } from '@vet/backend';
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
  program = input.required<ProgramShow | LongTerm | undefined>();
  vetIcons = vetIcons;

  get organisation() {
    return this.program()?.organisation as Organisation | undefined;
  }
}
