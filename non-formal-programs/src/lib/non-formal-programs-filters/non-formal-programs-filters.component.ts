import { ChangeDetectionStrategy, Component, computed, effect, input, output, signal } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import {
  ButtonComponent,
  IconButtonComponent,
  InputComponent,
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
    () => Object.keys(this.filters()).filter((key) => key !== 'search' && key !== 'organisation_name').length > 0,
  );
  formGroup = this.createFormGroup();
  isExpanded = signal(false);
  institutionOptions = useInstitutionsDictionary();
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
  }

  createFormGroup() {
    return new FormGroup({
      search: new FormControl<string>(''),
      organisation_name: new FormControl(''),
      field: new FormControl<string | null>(null),
      region: new FormControl<string | null>(null),
      district: new FormControl<string | null>(null),
      period: new FormControl<string | null>(null),
    });
  }

  onSubmit() {
    this.filtersChange.emit(withoutEmptyProperties(this.formGroup.value) as NonFormalProgramFilters);
  }

  onToggleExpansion() {
    this.isExpanded.update((isExpanded) => !isExpanded);
  }

  onClearClick() {
    this.formGroup.patchValue({
      search: '',
      organisation_name: '',
      field: null,
      region: null,
      district: null,
      period: null,
    });
    this.onSubmit();
  }
}
