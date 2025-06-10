import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { KENDO_ICONS } from '@progress/kendo-angular-icons';
import { vetIcons } from '@vet/shared';
import { ProgramPartner } from '@vet/backend';
import { TranslocoPipe } from '@jsverse/transloco';

@Component({
  selector: 'vet-short-program-partners',
  imports: [KENDO_ICONS, TranslocoPipe],
  templateUrl: './short-program-partners.component.html',
  styleUrl: './short-program-partners.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
})
export class ShortProgramPartnersComponent {
  partners = input.required<ProgramPartner[] | undefined>();
  vetIcons = vetIcons;
}
