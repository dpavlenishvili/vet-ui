import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { KENDO_ICONS } from '@progress/kendo-angular-icons';
import { vetIcons } from '@vet/shared';
import { ProgramPartner } from '@vet/backend';
import { TranslocoPipe } from '@jsverse/transloco';

@Component({
  selector: 'vet-program-partners',
  imports: [KENDO_ICONS, TranslocoPipe],
  templateUrl: './program-partners.component.html',
  styleUrl: './program-partners.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
})
export class ProgramPartnersComponent {
  partners = input.required<ProgramPartner[] | undefined>();
  vetIcons = vetIcons;
}

