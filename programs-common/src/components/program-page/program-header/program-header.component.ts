import { ProgramPartnersComponent } from '../program-partners/program-partners.component';
import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { vetIcons } from '@vet/shared';
import { LongTerm, ShortProgramShow } from '@vet/backend';
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
  program = input.required<ShortProgramShow | LongTerm | undefined>();
  details = input<ProgramDetailItem[]>([]);
  vetIcons = vetIcons;

  get organisation() {
    return this.program()?.organisation as Organisation | undefined;
  }
}
