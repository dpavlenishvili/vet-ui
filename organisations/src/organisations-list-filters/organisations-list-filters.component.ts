import { ChangeDetectionStrategy, Component, computed, effect, input, output, signal } from '@angular/core';
import { FormGroup, FormControl, ReactiveFormsModule } from '@angular/forms';
import { TranslocoPipe } from '@jsverse/transloco';
import {
  SelectorComponent,
  IconButtonComponent,
  withoutEmptyProperties,
  vetIcons,
  ButtonComponent,
  InputComponent,
  useControlValue,
} from '@vet/shared';
import { OrganisationFilters } from '../organisations.types';
import { useDistricts, useFilteredDistricts, useInstitutionsDictionary, useRegions } from '@vet/shared-resources';
import { NgTemplateOutlet } from '@angular/common';

@Component({
  selector: 'vet-organisations-list-filters',
  imports: [
    SelectorComponent,
    ReactiveFormsModule,
    TranslocoPipe,
    ButtonComponent,
    IconButtonComponent,
    InputComponent,
    NgTemplateOutlet
  ],
  templateUrl: './organisations-list-filters.component.html',
  styleUrl: './organisations-list-filters.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class OrganisationsListFiltersComponent {
  numberOfRecords = input<number>();
  filters = input.required<OrganisationFilters>();
  filtersChange = output<OrganisationFilters>();

  vetIcons = vetIcons;
  formGroup = this.createFormGroup();

  institutionOptions = useInstitutionsDictionary();



  hasExtraFilters = computed(() => Object.keys(this.filters()).filter((key) => key !== 'search').length > 0);
  isExpanded = signal(false);
  regionOptions = useRegions();
  districtOptions = useDistricts();
  isFiltersDialogOpen = signal(false);
  selectedRegion = useControlValue(this.formGroup, form => form.controls.region);
  filteredDistricts = useFilteredDistricts(this.selectedRegion, this.districtOptions.value);

  constructor() {
    effect(() => {
      if (this.hasExtraFilters()) {
        this.isExpanded.set(true);
      }
    });
  }

  createFormGroup() {
    return new FormGroup({
      search: new FormControl<string | null>(null),
      id: new FormControl<string | null>(null),
      name: new FormControl<string | null>(null),
      org_type: new FormControl<string | null>(null),
      institution_type_id: new FormControl<string | null>(null),
      region: new FormControl<string | null>(null),
      district: new FormControl<string | null>(null),
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
