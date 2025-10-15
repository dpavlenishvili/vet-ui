import { ProgramPartnersComponent } from '../program-partners/program-partners.component';
import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { vetIcons } from '@vet/shared';
import { LongTerm, NonFormalShow, ShortProgramShow } from '@vet/backend';
import { ProgramDetailsComponent } from '../program-details/program-details.component';
import { Organisation, ProgramDetailItem } from '../../../programs.types';

@Component({
  selector: 'vet-program-header',
  imports: [ProgramDetailsComponent, ProgramPartnersComponent],
  templateUrl: './program-header.component.html',
  styleUrl: './program-header.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
})
export class ProgramHeaderComponent {
  program = input.required<ShortProgramShow | LongTerm | NonFormalShow | undefined>();
  details = input<ProgramDetailItem[]>([]);
  showPartners = input<boolean>(true);
  vetIcons = vetIcons;

  get organisation() {
    return this.program()?.organisation as Organisation | undefined;
  }

  programName = computed(() => {
    const prog = this.program();

    if (!prog) return '';
    // NonFormalShow uses 'isced', others use 'program_name'
    return (prog as NonFormalShow).isced || (prog as ShortProgramShow | LongTerm).program_name || '';
  });

  programPartners = computed(() => {
    const prog = this.program();
    if (!prog) return undefined;

    // NonFormalShow doesn't have partners property
    if ('isced' in prog) {
      return undefined;
    }

    // ProgramShow and LongTerm have partners property
    return (prog as ShortProgramShow | LongTerm).partners;
  });
}
