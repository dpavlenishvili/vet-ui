import { ChangeDetectionStrategy, Component, effect, inject, input, output } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { TranslocoPipe } from '@jsverse/transloco';
import { OrganisationAdmissionListFilter } from '../admission-list-organisation.component';
import {
  ButtonComponent,
  IconButtonComponent,
  InputComponent,
  SelectorComponent,
  vetIcons,
  withoutEmptyProperties,
} from '@vet/shared';
import { GeneralsService } from '@vet/backend';
import { rxResource } from '@angular/core/rxjs-interop';
import { map } from 'rxjs';
import { isValidIdValue, mapIdValueToOption, useInstitutionsDictionary } from '@vet/shared-resources';

@Component({
  selector: 'vet-admission-filter-organisation',
  templateUrl: './admission-filter-organisation.component.html',
  styleUrl: './admission-filter-organisation.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [
    ButtonComponent,
    ReactiveFormsModule,
    TranslocoPipe,
    InputComponent,
    SelectorComponent,
    IconButtonComponent,
  ],
})
export class AdmissionFilterOrganisationComponent {
  numberOfRecords = input.required<number>();
  filters = input.required<OrganisationAdmissionListFilter>();
  filtersChange = output<OrganisationAdmissionListFilter>();

  generalsService = inject(GeneralsService);
  formGroup = this.createFormGroup();
  vetIcons = vetIcons;

  // Fetch organisations data
  institutionOptions = useInstitutionsDictionary();

  // Fetch status options
  statusOptions$ = rxResource({
    defaultValue: [],
    loader: () =>
      this.generalsService.getAllConfigs({ key: 'admission_status' }).pipe(
        map((res) => {
          // @ts-expect-error - API response structure
          return res['admission_status']?.filter(isValidIdValue).map(mapIdValueToOption) ?? [];
        }),
      ),
  });

  // SSM Status options (Yes/No)
  ssmStatusOptions = [
    { value: true, label: 'კი' },
    { value: false, label: 'არა' },
  ];

  constructor() {
    effect(() => {
      this.formGroup.patchValue(this.filters());
    });
  }

  createFormGroup() {
    return new FormGroup({
      personal_number: new FormControl<string | null>(null),
      name: new FormControl<string | null>(null),
      surname: new FormControl<string | null>(null),
      organisation_name: new FormControl<string | null>(null),
      status: new FormControl<string | null>(null),
      ssm_status: new FormControl<boolean | null>(null),
    });
  }

  onSubmit() {
    this.filtersChange.emit(withoutEmptyProperties(this.formGroup.value) as OrganisationAdmissionListFilter);
  }

  onClearClick() {
    this.formGroup.patchValue({
      personal_number: '',
      name: '',
      surname: '',
      organisation_name: '',
      status: null,
      ssm_status: null,
    });
    this.formGroup.updateValueAndValidity();
    this.onSubmit();
  }
}
