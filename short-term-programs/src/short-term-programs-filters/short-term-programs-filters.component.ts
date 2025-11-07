import { ChangeDetectionStrategy, Component, computed, effect, input, OnInit, output, signal } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import {
  ButtonComponent,
  EduactionStandartsComponent,
  IconButtonComponent,
  InputComponent,
  SelectorComponent,
  useControlValue,
  vetIcons,
  VetSwitchComponent,
  withoutEmptyProperties,
} from '@vet/shared';
import { TranslocoPipe } from '@jsverse/transloco';
import { NgTemplateOutlet } from '@angular/common';
import {
  useDistricts,
  useFilteredDistricts,
  useFilteredOrganisations,
  useOrganisations,
  useProgramKinds,
  useRegions,
} from '@vet/shared-resources';
import { ShortTermProgramFilters } from '../short-term-programs.types';
import { ShortTermProgramsFiltersDialogComponent } from '../short-term-programs-filters-dialog/short-term-programs-filters-dialog.component';
import { tap } from 'rxjs';

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
    EduactionStandartsComponent,
  ],
  templateUrl: './short-term-programs-filters.component.html',
  styleUrl: './short-term-programs-filters.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
})
export class ShortTermProgramsFiltersComponent implements OnInit {
  filters = input.required<ShortTermProgramFilters>();
  filtersChange = output<ShortTermProgramFilters>();

  hasExtraFilters = computed(() => Object.keys(this.filters()).filter((key) => key !== 'search').length > 0);
  formGroup = this.createFormGroup();
  isExpanded = signal(false);
  institutionOptions = useOrganisations();
  regionOptions = useRegions();
  districtOptions = useDistricts();
  programKindOptions = useProgramKinds('short-term');
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
      this.formGroup.patchValue(this.filters());

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
      isced_code: new FormControl<string | null>(null),
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

  onSubmit() {
    const raw = this.formGroup.value;

    const normalized = Object.fromEntries(
      Object.entries(raw).map(([key, value]) => {
        if (typeof value === 'boolean' && value === false) {
          return [key, undefined];
        }
        return [key, value];
      }),
    );

    this.filtersChange.emit(withoutEmptyProperties(normalized) as ShortTermProgramFilters);
  }

  onToggleExpansion() {
    this.isExpanded.update((isExpanded) => !isExpanded);
  }

  onClearClick() {
    this.formGroup.patchValue({
      search: '',
      program_name_or_code: '',
      organisation_name: '',
      isced_code: null,
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
    this.onSubmit();
  }

  onDialogFiltersChange(filters: ShortTermProgramFilters | null) {
    if (filters) {
      this.formGroup.patchValue(filters);
      this.onSubmit();
    }
  }

  onOpenFiltersDialog() {
    return this.isFiltersDialogOpen.set(true);
  }

  onCloseFiltersDialog() {
    return this.isFiltersDialogOpen.set(false);
  }
}
