import { ChangeDetectionStrategy, Component, computed, effect, input, OnInit, output } from '@angular/core';
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
  useFilteredOrganisations,
  useFinancingTypes,
  useGeneralPartners,
  useOrganisations,
  useProgramKinds,
  useRegions,
} from '@vet/shared-resources';
import { useFoundUnauthorizedUserPrograms } from '../unauthorised-programs.resources';
import { tap } from 'rxjs';

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
export class UnAuthorisedProgramsFiltersDialogComponent implements OnInit {
  filters = input.required<ProgramFilters>();
  filtersChange = output<ProgramFilters>();
  dialogClose = output();

  readonly normalizedFilters = computed(() => {
    const formVal = this.formValue();

    const hasActualValues = Object.entries(formVal).some(([key, value]) => {
      return value !== null && value !== '' && value !== false && value !== undefined;
    });

    if (!hasActualValues) {
      return null;
    }

    // Convert number region/district to string for ProgramFilters type
    return {
      ...formVal,
      region: formVal.region != null ? String(formVal.region) : null,
      district: formVal.district != null ? String(formVal.district) : null,
    } as ProgramFilters;
  });

  formGroup = this.createFormGroup();
  institutionOptions = useOrganisations();
  regionOptions = useRegions();
  districtOptions = useDistricts();
  programTypesOptions = useProgramKinds('long-term');
  financingTypeOptions = useFinancingTypes('short-term');
  partnersOptions = useGeneralPartners();
  formValue = useControlValue(this.formGroup);
  selectedRegion = useControlValue(this.formGroup, (form) => form.controls.region);
  selectedDistrict = useControlValue(this.formGroup, (form) => form.controls.district);
  filteredDistricts = useFilteredDistricts(this.selectedRegion, this.districtOptions.value);
  filteredOrganisations = useFilteredOrganisations(
    this.selectedRegion,
    this.selectedDistrict,
    this.institutionOptions.value,
  );
  foundResultsCount = useFoundUnauthorizedUserPrograms(this.normalizedFilters);

  vetIcons = vetIcons;

  constructor() {
    effect(() => {
      const filters = this.filters();
      // Convert string region/district from filters to number for form controls
      this.formGroup.patchValue({
        ...filters,
        region: filters.region != null ? Number(filters.region) : null,
        district: filters.district != null ? Number(filters.district) : null,
      });
    });
  }

  ngOnInit(): void {
    this.onRegionChange();
    this.onDistrictChange();
  }

  onRegionChange() {
    const regionControl = this.formGroup.get('region');
    const districtControl = this.formGroup.get('district');
    const organisationControl = this.formGroup.get('organisation_name');

    regionControl?.valueChanges
      .pipe(
        tap(() => {
          districtControl?.reset();
          organisationControl?.reset();
        }),
      )
      .subscribe();
  }

  onDistrictChange() {
    const districtControl = this.formGroup.get('district');
    const organisationControl = this.formGroup.get('organisation_name');

    districtControl?.valueChanges
      .pipe(
        tap(() => {
          organisationControl?.reset();
        }),
      )
      .subscribe();
  }

  createFormGroup() {
    return new FormGroup({
      search: new FormControl(''),
      program_name_or_code: new FormControl(''),
      field: new FormControl<string | null>(null),
      duration: new FormControl<string | null>(null),
      region: new FormControl<number | null>(null),
      district: new FormControl<number | null>(null),
      organisation: new FormControl(''),
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
      const formVal = this.formGroup.value;
      // Convert number region/district to string for ProgramFilters type
      const normalized = {
        ...formVal,
        region: formVal.region != null ? String(formVal.region) : null,
        district: formVal.district != null ? String(formVal.district) : null,
      };
      this.filtersChange.emit(withoutEmptyProperties(normalized) as ProgramFilters);
      this.onClose();
    }
  }

  onClearClick() {
    this.formGroup.patchValue({
      search: '',
      program_name_or_code: '',
      organisation: null,
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
