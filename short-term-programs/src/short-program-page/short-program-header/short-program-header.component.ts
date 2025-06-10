import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { vetIcons } from '@vet/shared';
import { ShortProgramShow } from '@vet/backend';
import { ShortProgramAdmissionsComponent } from '../short-program-admissions/short-program-admissions.component';
import { ShortProgramDetailsComponent } from '../short-program-details/short-program-details.component';
import { ShortProgramPartnersComponent } from '../short-program-partners/short-program-partners.component';

@Component({
  selector: 'vet-short-program-header',
  imports: [ShortProgramAdmissionsComponent, ShortProgramDetailsComponent, ShortProgramPartnersComponent],
  templateUrl: './short-program-header.component.html',
  styleUrl: './short-program-header.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
})
export class ShortProgramHeaderComponent {
  program = input.required<ShortProgramShow>();
  vetIcons = vetIcons;
}
