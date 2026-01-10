import { ChangeDetectionStrategy, Component, computed, effect, input, output, signal, OnInit } from '@angular/core';
import { FormGroup, FormControl, ReactiveFormsModule } from '@angular/forms';
import { TranslocoPipe } from '@jsverse/transloco';
import { vetIcons } from '@vet/shared/icons';
import { useControlValue, withoutEmptyProperties } from '@vet/shared/utils';
import {
  ButtonComponent,
  IconButtonComponent,
  InputComponent,
  SelectorComponent,
} from '@vet/shared';
import { OrganisationFilters } from '../organisations.types';
import {
  useDistricts,
  useFilteredDistricts,
  useFilteredOrganisations,
  useOrganisations,
  useRegions,
} from '@vet/shared-resources';
import { NgTemplateOutlet } from '@angular/common';
import { tap } from 'rxjs';
import { useInstitutionOrgType, useInstitutionTypes } from '../organisations.resources';

@Component({
  selector: 'vet-organisations-list-filters',
  imports: [
    SelectorComponent,
    ReactiveFormsModule,
    TranslocoPipe,
    ButtonComponent,
    IconButtonComponent,
    InputComponent,
    NgTemplateOutlet,
  ],
  templateUrl: './organisations-list-filters.component.html',
  styleUrl: './organisations-list-filters.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class OrganisationsListFiltersComponent implements OnInit {
  numberOfRecords = input<number>();
  filters = input.required<OrganisationFilters>();
  filtersChange = output<OrganisationFilters>();

  vetIcons = vetIcons;
  formGroup = this.createFormGroup();

  hasExtraFilters = computed(() => Object.keys(this.filters()).filter((key) => key !== 'search').length > 0);
  isExpanded = signal(false);
  isFiltersDialogOpen = signal(false);

  institutionOptions = useOrganisations();
  regionOptions = useRegions();
  districtOptions = useDistricts();
  institutionTypesOptions = useInstitutionTypes();
  institutionOrgType = useInstitutionOrgType();
  selectedRegion = useControlValue(this.formGroup, (form) => form.controls.region);
  selectedDistrict = useControlValue(this.formGroup, (form) => form.controls.district);
  filteredDistricts = useFilteredDistricts(this.selectedRegion, this.districtOptions.value);
  filteredOrganisations = useFilteredOrganisations(
    this.selectedRegion,
    this.selectedDistrict,
    this.institutionOptions.value,
  );

  constructor() {
    effect(() => {
      const filters = this.filters();
      this.formGroup.patchValue(filters);

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
      search: new FormControl<string | null>(null),
      id: new FormControl<number | null>(null),
      name: new FormControl<string | null>(null),
      org_type: new FormControl<string | null>(null),
      institution_type_id: new FormControl<string | null>(null),
      region: new FormControl<number | null>(null),
      district: new FormControl<number | null>(null),
    });
  }

  onSubmit() {
    this.filtersChange.emit(withoutEmptyProperties(this.formGroup.value) as OrganisationFilters);
  }

  onToggleExpansion() {
    this.isExpanded.update((isExpanded) => !isExpanded);
  }

  onClearClick() {
    this.formGroup.patchValue({
      search: null,
      id: null,
      name: null,
      org_type: null,
      region: null,
      district: null,
      institution_type_id: null,
    });
    this.formGroup.updateValueAndValidity();
    this.onSubmit();
  }

  onOpenFiltersDialog() {
    return this.isFiltersDialogOpen.set(true);
  }

  onCloseFiltersDialog() {
    return this.isFiltersDialogOpen.set(false);
  }
}
