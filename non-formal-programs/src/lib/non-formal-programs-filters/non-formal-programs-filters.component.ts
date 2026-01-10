import { ChangeDetectionStrategy, Component, computed, effect, input, output, signal } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { vetIcons } from '@vet/shared/icons';
import { isDate, useControlValue, withoutEmptyProperties } from '@vet/shared/utils';
import { ButtonComponent, DatePickerComponent, IconButtonComponent, InputComponent, SelectorComponent } from '@vet/shared';
import { EducationStandartsComponent } from '@vet/long-term-programs';
import { TranslocoPipe } from '@jsverse/transloco';
import { NgTemplateOutlet } from '@angular/common';
import {
  useDistricts,
  useFilteredDistricts,
  useFilteredOrganisations,
  useOrganisations,
  useRegions,
} from '@vet/shared-resources';
import { NonFormalProgramFilters } from '../non-formal-programs.types';

@Component({
  selector: 'vet-non-formal-programs-filters',
  imports: [
    ReactiveFormsModule,
    TranslocoPipe,
    SelectorComponent,
    ButtonComponent,
    NgTemplateOutlet,
    InputComponent,
    IconButtonComponent,
    DatePickerComponent,
    EducationStandartsComponent,
  ],
  templateUrl: './non-formal-programs-filters.component.html',
  styleUrl: './non-formal-programs-filters.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
})
export class NonFormalProgramsFiltersComponent {
  filters = input.required<NonFormalProgramFilters>();
  filtersChange = output<NonFormalProgramFilters>();

  hasExtraFilters = computed(
    () => Object.keys(this.filters()).filter((key) => key !== 'search' && key !== 'organisation').length > 0,
  );
  formGroup = this.createFormGroup();
  isExpanded = signal(false);
  institutionOptions = useOrganisations();
  regionOptions = useRegions();
  districtOptions = useDistricts();
  selectedRegion = useControlValue(this.formGroup, (form) => form.controls.region);
  selectedDistrict = useControlValue(this.formGroup, (form) => form.controls.district);
  filteredDistricts = useFilteredDistricts(this.selectedRegion, this.districtOptions.value);
  filteredInstitutions = useFilteredOrganisations(
    this.selectedRegion,
    this.selectedDistrict,
    this.institutionOptions.value,
  );

  vetIcons = vetIcons;

  constructor() {
    effect(() => {
      this.formGroup.patchValue(this.filters());

      if (this.hasExtraFilters()) {
        this.isExpanded.set(true);
      }
    });

    effect(
      () => {
        this.selectedRegion();
        this.formGroup.controls.district.setValue(null);
      },
      { allowSignalWrites: true },
    );

    effect(
      () => {
        this.selectedRegion();
        this.selectedDistrict();
        this.formGroup.controls.organisation.setValue(null);
      },
      { allowSignalWrites: true },
    );
  }

  createFormGroup() {
    return new FormGroup({
      search: new FormControl<string>(''),
      organisation: new FormControl<number | null>(null),
      isced_code: new FormControl<string[] | null>(null),
      region: new FormControl<number | null>(null),
      district: new FormControl<number | null>(null),
      registration_start_from: new FormControl<string | Date | null>(null),
      registration_start_to: new FormControl<string | Date | null>(null),
    });
  }

  onSubmit() {
    const normalizedFilters = this.normalizeFilters(this.formGroup.value);
    const filtered = withoutEmptyProperties(normalizedFilters) as NonFormalProgramFilters;

    if (filtered.isced_code && !Array.isArray(filtered.isced_code)) {
      filtered.isced_code = Object.values(filtered.isced_code);
    }

    this.filtersChange.emit(filtered);
  }

  normalizeFilters(filterValue: any): NonFormalProgramFilters {
    return {
      search: filterValue.search || null,
      region: filterValue.region != null ? Number(filterValue.region) : null,
      district: filterValue.district != null ? Number(filterValue.district) : null,
      organisation: filterValue.organisation != null ? Number(filterValue.organisation) : null,
      isced_code: this.normalizeIsced(filterValue.isced_code),
      registration_start_from: isDate(filterValue.registration_start_from)
        ? this.formatDateForBackend(filterValue.registration_start_from)
        : filterValue.registration_start_from,
      registration_start_to: isDate(filterValue.registration_start_to)
        ? this.formatDateForBackend(filterValue.registration_start_to)
        : filterValue.registration_start_to,
    };
  }

  private normalizeIsced(value: any): string[] | null {
    if (!value) return null;

    if (Array.isArray(value)) return value;

    if (typeof value === 'object') {
      return Object.values(value);
    }

    return null;
  }

  formatDateForBackend(date: Date): string {
    return `${date.getFullYear()}-${(date.getMonth() + 1)
      .toString()
      .padStart(2, '0')}-${date.getDate().toString().padStart(2, '0')}`;
  }

  onToggleExpansion() {
    this.isExpanded.update((isExpanded) => !isExpanded);
  }

  onClearClick() {
    this.formGroup.patchValue({
      search: '',
      organisation: null,
      isced_code: null,
      region: null,
      district: null,
      registration_start_from: null,
      registration_start_to: null,
    });
    this.onSubmit();
  }
}
