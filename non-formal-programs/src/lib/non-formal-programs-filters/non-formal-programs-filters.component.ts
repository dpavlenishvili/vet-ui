import { ChangeDetectionStrategy, Component, computed, effect, input, output, signal } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import {
  ButtonComponent,
  DatePickerComponent,
  IconButtonComponent,
  InputComponent,
  isDate,
  SelectorComponent,
  useControlValue,
  vetIcons,
  withoutEmptyProperties,
} from '@vet/shared';
import { TranslocoPipe } from '@jsverse/transloco';
import { NgTemplateOutlet } from '@angular/common';
import { useDistricts, useFilteredDistricts, useInstitutionsDictionary, useRegions } from '@vet/shared-resources';
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
  institutionOptions = useInstitutionsDictionary(true);
  regionOptions = useRegions();
  districtOptions = useDistricts();
  selectedRegion = useControlValue(this.formGroup, (form) => form.controls.region);
  filteredDistricts = useFilteredDistricts(this.selectedRegion, this.districtOptions.value);

  vetIcons = vetIcons;

  constructor() {
    effect(() => {
      this.formGroup.patchValue(this.filters());

      if (this.hasExtraFilters()) {
        this.isExpanded.set(true);
      }
    });

    // Clear district when region changes
    effect(
      () => {
        this.selectedRegion(); // Track region changes
        this.formGroup.controls.district.setValue(null);
      },
      { allowSignalWrites: true },
    );
  }

  createFormGroup() {
    return new FormGroup({
      search: new FormControl<string>(''),
      organisation: new FormControl<number | null>(null),
      field: new FormControl<string | null>(null),
      region: new FormControl<number | null>(null),
      district: new FormControl<number | null>(null),
      start_date: new FormControl<string | Date | null>(null),
      end_date: new FormControl<string | Date | null>(null),
    });
  }

  onSubmit() {
    const normalizedFilters = this.normalizeFilters(this.formGroup.value);
    this.filtersChange.emit(withoutEmptyProperties(normalizedFilters) as NonFormalProgramFilters);
  }

  normalizeFilters(filterValue: any): NonFormalProgramFilters {
    return {
      search: filterValue.search || null,
      // Convert IDs to numbers to match API expectations (filters[region], filters[district], filters[organisation])
      region: filterValue.region != null ? Number(filterValue.region) : null,
      district: filterValue.district != null ? Number(filterValue.district) : null,
      organisation: filterValue.organisation != null ? Number(filterValue.organisation) : null,
      // Keep unsupported filters in code but they won't be sent to API
      field: filterValue.field || null,
      start_date: isDate(filterValue.start_date)
        ? this.formatDateForBackend(filterValue.start_date)
        : filterValue.start_date,
      end_date: isDate(filterValue.end_date) ? this.formatDateForBackend(filterValue.end_date) : filterValue.end_date,
    };
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
      field: null,
      region: null,
      district: null,
      start_date: null,
      end_date: null,
    });
    this.onSubmit();
  }
}
