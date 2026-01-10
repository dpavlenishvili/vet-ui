import { UnAuthorisedProgramsFiltersDialogComponent } from './../unauthorised-filters-dialog/unauthorised-programs-filters-dialog.component';
import { ChangeDetectionStrategy, Component, computed, effect, input, OnInit, output, signal } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { vetIcons } from '@vet/shared/icons';
import { useControlValue, withoutEmptyProperties } from '@vet/shared/utils';
import { ButtonComponent, IconButtonComponent, InputComponent, SelectorComponent, VetSwitchComponent } from '@vet/shared';
import { EducationStandartsComponent } from '@vet/long-term-programs';
import { TranslocoPipe } from '@jsverse/transloco';
import { NgTemplateOutlet } from '@angular/common';
import { ProgramFilters } from '@vet/programs-common';
import {
  useDistricts,
  useFilteredDistricts,
  useFilteredOrganisations,
  useOrganisations,
  useProgramKinds,
  useRegions,
} from '@vet/shared-resources';
import { tap } from 'rxjs';

@Component({
  selector: 'vet-unauthorised-programs-filters',
  imports: [
    ReactiveFormsModule,
    TranslocoPipe,
    SelectorComponent,
    VetSwitchComponent,
    ButtonComponent,
    NgTemplateOutlet,
    UnAuthorisedProgramsFiltersDialogComponent,
    InputComponent,
    IconButtonComponent,
    EducationStandartsComponent,
  ],
  templateUrl: './unauthorised-filters.component.html',
  styleUrl: './unauthorised-programs-filters.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
})
export class UnAuthorisedProgramsFiltersComponent implements OnInit {
  filters = input.required<ProgramFilters>();
  filtersChange = output<ProgramFilters>();

  hasExtraFilters = computed(() => Object.keys(this.filters()).filter((key) => key !== 'search').length > 0);
  formGroup = this.createFormGroup();
  isExpanded = signal(false);
  institutionOptions = useOrganisations();
  regionOptions = useRegions();
  districtOptions = useDistricts();
  programTypesOptions = useProgramKinds('long-term');
  isFiltersDialogOpen = signal(false);
  selectedRegion = useControlValue(this.formGroup, (form) => form.controls.region);
  selectedDistrict = useControlValue(this.formGroup, (form) => form.controls.district);
  filteredDistricts = useFilteredDistricts(this.selectedRegion, this.districtOptions.value);
  filteredOrganisations = useFilteredOrganisations(
    this.selectedRegion,
    this.selectedDistrict,
    this.institutionOptions.value,
  );

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

      if (this.hasExtraFilters()) {
        this.isExpanded.set(true);
      }
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
      search: new FormControl<string>(''),
      program_name_or_code: new FormControl(''),
      nqf_codes: new FormControl<string[] | null>(null),
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
    const raw = this.formGroup.value;

    const normalized = Object.fromEntries(
      Object.entries(raw).map(([key, value]) => {
        if (typeof value === 'boolean' && value === false) {
          return [key, undefined];
        }
        // Convert number region/district to string for ProgramFilters type
        if ((key === 'region' || key === 'district') && value != null) {
          return [key, String(value)];
        }
        return [key, value];
      }),
    );

    this.filtersChange.emit(withoutEmptyProperties(normalized) as ProgramFilters);
  }

  onToggleExpansion() {
    this.isExpanded.update((isExpanded) => !isExpanded);
  }

  onClearClick() {
    this.formGroup.patchValue({
      search: '',
      program_name_or_code: '',
      organisation: '',
      nqf_codes: null,
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

  onDialogFiltersChange(filters: ProgramFilters) {
    // Convert string region/district from filters to number for form controls
    this.formGroup.patchValue({
      ...filters,
      region: filters.region != null ? Number(filters.region) : null,
      district: filters.district != null ? Number(filters.district) : null,
    });
    this.onSubmit();
  }

  onOpenFiltersDialog() {
    return this.isFiltersDialogOpen.set(true);
  }

  onCloseFiltersDialog() {
    return this.isFiltersDialogOpen.set(false);
  }
}
