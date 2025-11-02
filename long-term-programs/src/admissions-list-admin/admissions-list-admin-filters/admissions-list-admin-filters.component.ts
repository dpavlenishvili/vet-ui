import { ChangeDetectionStrategy, Component, effect, inject, input, output } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { TranslocoPipe } from '@jsverse/transloco';
import {
  ButtonComponent as VetButtonComponent,
  IconButtonComponent,
  InputComponent,
  SelectorComponent,
  vetIcons,
  withoutEmptyProperties
} from '@vet/shared';
import { GeneralsService } from '@vet/backend';
import { isValidIdValue, mapIdValueToOption, useInstitutionsDictionary } from '@vet/shared-resources';
import { rxResource } from '@angular/core/rxjs-interop';
import { map } from 'rxjs';
import { AdmissionListFilterParams } from '../../long-term-programs.types';

@Component({
  selector: 'vet-admissions-list-admin-filters',
  templateUrl: './admissions-list-admin-filters.component.html',
  styleUrl: './admissions-list-admin-filters.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [
    VetButtonComponent,
    ReactiveFormsModule,
    TranslocoPipe,
    InputComponent,
    SelectorComponent,
    IconButtonComponent,
  ],
})
export class AdmissionsListAdminFiltersComponent {
  numberOfRecords = input.required<number>();
  filters = input.required<AdmissionListFilterParams>();
  filtersChange = output<AdmissionListFilterParams>();

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
    { value: 'true', label: 'კი' },
    { value: 'false', label: 'არა' },
  ];

  constructor() {
    effect(() => {
      this.formGroup.patchValue(this.filters());
    });
  }

  createFormGroup() {
    return new FormGroup({
      pid: new FormControl<string | null>(null),
      name: new FormControl<string | null>(null),
      lastname: new FormControl<string | null>(null),
      organisation: new FormControl<string | null>(null),
      status: new FormControl<string | null>(null),
      specStatus: new FormControl<boolean | null>(null),
    });
  }

  onSubmit() {
    this.filtersChange.emit(withoutEmptyProperties(this.formGroup.value) as AdmissionListFilterParams);
  }

  onClearClick() {
    this.formGroup.patchValue({
      pid: '',
      name: '',
      lastname: '',
      organisation: '',
      status: null,
      specStatus: null,
    });
    this.formGroup.updateValueAndValidity();
    this.onSubmit();
  }
}
