import { ChangeDetectionStrategy, Component } from '@angular/core';

export type OrganisationAdmissionListFilter = {
  personal_number?: string | null;
  name?: string | null;
  surname?: string | null;
  status?: string | null;
  ssm_status?: boolean | null;
};

@Component({
  selector: 'vet-admission-list-organisation',
  imports: [],
  templateUrl: './admission-list-organisation.component.html',
  styleUrl: './admission-list-organisation.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
})
export class AdmissionListOrganisationComponent {}
