import { ChangeDetectionStrategy, Component, effect, input, output } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import {
  ButtonComponent,
  DialogComponent,
  InputComponent,
  SelectorComponent,
  useControlValue,
  vetIcons,
  VetSwitchComponent,
  withoutEmptyProperties,
} from '@vet/shared';
import { TranslocoPipe } from '@jsverse/transloco';
import { ProgramFilters } from '@vet/programs-common';
import {
  useDistricts,
  useFilteredDistricts,
  useFinancingTypes,
  useInstitutionsDictionary,
  usePartners,
  useProgramKinds,
  useRegions,
} from '@vet/shared-resources';
import { useFoundUnauthorizedUserPrograms } from '../unauthorised-programs.resources';

@Component({
  selector: 'vet-unauthorised-programs-filters-dialog',
  imports: [
    ReactiveFormsModule,
    TranslocoPipe,
    FormsModule,
    DialogComponent,
    SelectorComponent,
    VetSwitchComponent,
    InputComponent,
    ButtonComponent,
  ],
  templateUrl: './unauthorised-programs-filters-dialog.component.html',
  styleUrl: './unauthorised-programs-filters-dialog.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
})
export class UnAuthorisedProgramsFiltersDialogComponent {
  filters = input.required<ProgramFilters>();
  filtersChange = output<ProgramFilters>();
  dialogClose = output();

  formGroup = this.createFormGroup();
  institutionOptions = useInstitutionsDictionary();
  regionOptions = useRegions();
  districtOptions = useDistricts();
  programTypesOptions = useProgramKinds('long-term');
  financingTypeOptions = useFinancingTypes('short-term');
  partnerOptions = usePartners('short-term');
  formValue = useControlValue(this.formGroup);
  selectedRegion = useControlValue(this.formGroup, (form) => form.controls.region);
  filteredDistricts = useFilteredDistricts(this.selectedRegion, this.districtOptions.value);
  foundResultsCount = useFoundUnauthorizedUserPrograms(this.formValue);

  vetIcons = vetIcons;

  constructor() {
    effect(() => {
      this.formGroup.patchValue(this.filters());
    });
  }

  createFormGroup() {
    return new FormGroup({
      search: new FormControl(''),
      program_name_or_code: new FormControl(''),
      field: new FormControl<string | null>(null),
      duration: new FormControl<string | null>(null),
      region: new FormControl<string | null>(null),
      district: new FormControl<string | null>(null),
      organisation_name: new FormControl(''),
      program_type: new FormControl<string | null>(null),
      tuition_start_date: new FormControl<string | null>(null),
      tuition_end_date: new FormControl<string | null>(null),
      financing_type: new FormControl<string | null>(null),
      partner: new FormControl<string | null>(null),
      integrated: new FormControl(false),
      admission_open: new FormControl(false),
    });
  }

  onSubmit() {
    if (this.formGroup.valid) {
      this.filtersChange.emit(withoutEmptyProperties(this.formGroup.value) as ProgramFilters);
      this.onClose();
    }
  }

  onClearClick() {
    this.formGroup.patchValue({
      search: '',
      program_name_or_code: '',
      organisation_name: '',
      field: null,
      region: null,
      district: null,
      program_type: null,
      tuition_start_date: null,
      tuition_end_date: null,
      financing_type: null,
      partner: null,
      integrated: null,
      admission_open: null,
    });
    this.onSubmit();
  }

  onClose() {
    this.dialogClose.emit();
  }
}
