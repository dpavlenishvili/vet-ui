import { UnAuthorisedProgramsFiltersDialogComponent } from './../unauthorised-filters-dialog/unauthorised-programs-filters-dialog.component';
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
import { ProgramFilters } from '@vet/programs-common';
import {
  useDistricts,
  useFilteredDistricts,
  useInstitutionsDictionary,
  useProgramKinds,
  useRegions
} from '@vet/shared-resources';

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
    ButtonComponent,
    IconButtonComponent,
  ],
  templateUrl: './unauthorised-filters.component.html',
  styleUrl: './unauthorised-programs-filters.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
})
export class UnAuthorisedProgramsFiltersComponent {
  filters = input.required<ProgramFilters>();
  filtersChange = output<ProgramFilters>();

  hasExtraFilters = computed(() => Object.keys(this.filters()).filter((key) => key !== 'search').length > 0);
  formGroup = this.createFormGroup();
  isExpanded = signal(false);
  institutionOptions = useInstitutionsDictionary();
  regionOptions = useRegions();
  districtOptions = useDistricts();
  programTypesOptions = useProgramKinds('long-term');
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
    this.filtersChange.emit(withoutEmptyProperties(this.formGroup.value) as ProgramFilters);
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
