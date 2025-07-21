import { ChangeDetectionStrategy, Component, inject, input, output } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { OrganisationAdmissionListFilter } from '../admission-list-organisation.component';
import { kendoIcons, vetIcons } from '@vet/shared';
import { isValidIdValue, mapIdValueToOption } from '@vet/shared-resources';
import { GeneralsService } from '@vet/backend';
import { rxResource } from '@angular/core/rxjs-interop';
import { map } from 'rxjs';
import { UserRolesService } from '@vet/auth';

@Component({
  selector: 'vet-admission-filter-organisation',
  templateUrl: './admission-filter-organisation.component.html',
  styleUrl: './admission-filter-organisation.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [FormsModule, ReactiveFormsModule],
})
export class AdmissionFilterOrganisationComponent {
  itemsCount = input<number>(0);
  filtersChange = output<OrganisationAdmissionListFilter>();

  filterForm = this.createFormGroup();
  kendoIcons = kendoIcons;
  vetIcons = vetIcons;

  private readonly generalsService = inject(GeneralsService);
  private readonly userRolesService = inject(UserRolesService);

  // Get admission statuses for filter
  admissionStatus$ = rxResource({
    defaultValue: [],
    loader: () =>
      this.generalsService.getAllConfigs({ key: 'admission_status' }).pipe(
        map((res) => {
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          // @ts-expect-error
          return res['admission_status']?.filter(isValidIdValue).map(mapIdValueToOption) ?? [];
        }),
      ),
  });

  // Get institutions for filter
  institutions$ = rxResource({
    defaultValue: [],
    loader: () =>
      this.generalsService.getOrganisationsList().pipe(
        map((response: any) => {
          return response.data?.filter(isValidIdValue).map(mapIdValueToOption) ?? [];
        }),
      ),
  });

  // SSM status options
  ssmStatusOptions = [
    { value: true, label: 'programs.yes' },
    { value: false, label: 'programs.no' },
  ];

  createFormGroup() {
    return new FormGroup({
      personal_number: new FormControl(''),
      name: new FormControl(''),
      surname: new FormControl(''),
      institution: new FormControl(null),
      status: new FormControl(null),
      ssm_status: new FormControl(null),
    });
  }

  clearFilters() {
    this.filterForm.reset();
    this.onSubmit();
  }

  onSubmit() {
    const value = this.filterForm.value;

    const filterData: OrganisationAdmissionListFilter = {
      personal_number: value.personal_number || undefined,
      name: value.name || undefined,
      surname: value.surname || undefined,
      institution: value.institution || undefined,
      status: value.status || undefined,
      ssm_status: value.ssm_status !== null ? value.ssm_status : undefined,
    };

    this.filtersChange.emit(filterData);
  }
}
