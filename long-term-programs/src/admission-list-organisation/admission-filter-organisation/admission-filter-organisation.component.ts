import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'vet-admission-filter-organisation',
  templateUrl: './admission-filter-organisation.component.html',
  styleUrl: './admission-filter-organisation.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [],
})
export class AdmissionFilterOrganisationComponent {}
