import {
  ChangeDetectionStrategy,
  Component,
  computed,
  effect,
  input,
  output,
  ResourceRef,
  signal,
} from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import {
  ButtonComponent,
  IconButtonComponent,
  InputComponent,
  SelectorComponent, useControlValue,
  vetIcons,
  VetSwitchComponent,
  withoutEmptyProperties
} from '@vet/shared';
import { TranslocoPipe } from '@jsverse/transloco';
import { NgTemplateOutlet } from '@angular/common';
import {
  useDistricts,
  useFilteredDistricts,
  useInstitutionsDictionary,
  useProgramKinds,
  useRegions
} from '@vet/shared-resources';
import { ShortTermProgramFilters } from '../short-term-programs.types';
import { ShortTermProgramsFiltersDialogComponent } from '../short-term-programs-filters-dialog/short-term-programs-filters-dialog.component';

@Component({
  selector: 'vet-short-term-programs-filters',
  imports: [
    ReactiveFormsModule,
    TranslocoPipe,
    SelectorComponent,
    VetSwitchComponent,
    ButtonComponent,
    NgTemplateOutlet,
    ShortTermProgramsFiltersDialogComponent,
    InputComponent,
    ButtonComponent,
    IconButtonComponent,
  ],
  templateUrl: './short-term-programs-filters.component.html',
  styleUrl: './short-term-programs-filters.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
})
export class ShortTermProgramsFiltersComponent {
  filters = input.required<ShortTermProgramFilters>();
  filtersChange = output<ShortTermProgramFilters>();

  hasExtraFilters = computed(() => Object.keys(this.filters()).filter((key) => key !== 'search').length > 0);
  formGroup = this.createFormGroup();
  isExpanded = signal(false);
  institutionOptions = useInstitutionsDictionary();
  regionOptions = useRegions();
  districtOptions = useDistricts();
  programKindOptions = useProgramKinds('short-term');
  isFiltersDialogOpen = signal(false);
  selectedRegion = useControlValue(this.formGroup, form => form.controls.region);
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
      program_name_or_code: new FormControl(''),
      field: new FormControl<string | null>(null),
      region: new FormControl<string | null>(null),
      district: new FormControl<string | null>(null),
      organisation_name: new FormControl(''),
      program_kind: new FormControl<string | null>(null),
      start_study: new FormControl<string | null>(null),
      end_study: new FormControl<string | null>(null),
      financing_type: new FormControl<string | null>(null),
      partner: new FormControl<string | null>(null),
      current: new FormControl(false),
      planned: new FormControl(false),
    });
  }

  onSubmit() {
    this.filtersChange.emit(withoutEmptyProperties(this.formGroup.value) as ShortTermProgramFilters);
  }

  onToggleExpansion() {
    this.isExpanded.update((isExpanded) => !isExpanded);
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
      financing_type: null,
      partner: null,
      current: null,
      planned: null,
    });
    this.onSubmit();
  }

  onDialogFiltersChange(filters: ShortTermProgramFilters) {
    this.formGroup.patchValue(filters);
    this.onSubmit();
  }

  onOpenFiltersDialog() {
    return this.isFiltersDialogOpen.set(true);
  }

  onCloseFiltersDialog() {
    return this.isFiltersDialogOpen.set(false);
  }
}
