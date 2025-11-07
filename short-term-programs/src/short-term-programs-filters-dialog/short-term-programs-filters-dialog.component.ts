import { ChangeDetectionStrategy, Component, computed, effect, input, OnInit, output } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import {
  ButtonComponent,
  DatePickerComponent,
  DialogComponent,
  InputComponent,
  isDate,
  SelectorComponent,
  useControlValue,
  vetIcons,
  VetSwitchComponent,
} from '@vet/shared';
import { TranslocoPipe } from '@jsverse/transloco';
import {
  useDistricts,
  useFilteredDistricts,
  useFilteredOrganisations,
  useFunding,
  useGeneralPartners,
  useOrganisations,
  useProgramKinds,
  useRegions,
} from '@vet/shared-resources';
import { ShortTermProgramFilters } from '../short-term-programs.types';
import { useFoundProgramsCount } from '../short-term.resources';
import { tap } from 'rxjs';

@Component({
  selector: 'vet-short-term-programs-filters-dialog',
  imports: [
    ReactiveFormsModule,
    TranslocoPipe,
    FormsModule,
    DialogComponent,
    SelectorComponent,
    VetSwitchComponent,
    DatePickerComponent,
    InputComponent,
    ButtonComponent,
  ],
  templateUrl: './short-term-programs-filters-dialog.component.html',
  styleUrl: './short-term-programs-filters-dialog.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
})
export class ShortTermProgramsFiltersDialogComponent implements OnInit {
  filters = input.required<ShortTermProgramFilters>();
  filtersChange = output<ShortTermProgramFilters | null>();
  dialogClose = output();

  readonly normalizedFilters = computed(() => {
    const formVal = this.formValue();

    const hasActualValues = Object.entries(formVal).some(([key, value]) => {
      return value !== null && value !== '' && value !== false && value !== undefined;
    });

    if (!hasActualValues) {
      return null;
    }

    return this.normalizeFilters(formVal);
  });

  formGroup = this.createFormGroup();
  institutionOptions = useOrganisations();
  regionOptions = useRegions();
  districtOptions = useDistricts();
  programKindOptions = useProgramKinds('short-term');
  financingTypeOptions = useFunding();
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
  foundResultsCount = useFoundProgramsCount(this.normalizedFilters);

  vetIcons = vetIcons;

  constructor() {
    effect(() => {
      this.formGroup.patchValue(this.filters());
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
      region: new FormControl<string | null>(null),
      district: new FormControl<string | null>(null),
      organisation_name: new FormControl(''),
      program_kind: new FormControl<string | null>(null),
      start_study: new FormControl<string | null>(null),
      end_study: new FormControl<string | null>(null),
      funded: new FormControl<string | null>(null),
      partner: new FormControl<string | null>(null),
      current: new FormControl(false),
      planned: new FormControl(false),
    });
  }

  normalizeFilters(filterValue: ShortTermProgramFilters) {
    return {
      ...filterValue,
      start_study: isDate(filterValue.start_study)
        ? this.formatDateForBackend(filterValue.start_study)
        : filterValue.start_study,

      end_study: isDate(filterValue.end_study)
        ? this.formatDateForBackend(filterValue.end_study)
        : filterValue.end_study,
    } as ShortTermProgramFilters;
  }

  formatDateForBackend(date: Date): string {
    return `${date.getFullYear()}-${(date.getMonth() + 1)
      .toString()
      .padStart(2, '0')}-${date.getDate().toString().padStart(2, '0')}`;
  }

  onSubmit() {
    if (this.formGroup.valid) {
      this.filtersChange.emit(this.normalizedFilters());
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
      program_kind: null,
      start_study: null,
      end_study: null,
      funded: null,
      partner: null,
      current: null,
      planned: null,
    });
  }

  onClose() {
    this.dialogClose.emit();
  }
}
