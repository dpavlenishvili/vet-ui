import { District, vetIcons } from '@vet/shared';
import { ChangeDetectionStrategy, Component, DestroyRef, effect, inject, input, output, signal } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { TranslocoPipe } from '@jsverse/transloco';
import { ButtonModule } from '@progress/kendo-angular-buttons';
import { DropDownsModule } from '@progress/kendo-angular-dropdowns';
import { SVGIconModule } from '@progress/kendo-angular-icons';
import { InputsModule } from '@progress/kendo-angular-inputs';
import { LabelModule } from '@progress/kendo-angular-label';
import { CardModule } from '@progress/kendo-angular-layout';
import * as kendoIcons from '@progress/kendo-svg-icons';
import { GeneralsService } from '@vet/backend';
import { debounceTime, map } from 'rxjs/operators';
import { ProgramSelectionFilter } from '../program-selection-step.component';
import { DateInputsModule } from '@progress/kendo-angular-dateinputs';
import { rxResource, takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { TooltipDirective } from '@progress/kendo-angular-tooltip';

interface Organisations {
  id?: number;
  name?: string;
  region_id?: number;
  district_id?: number;
}

@Component({
  selector: 'vet-program-selection-filters',
  imports: [
    InputsModule,
    ButtonModule,
    ReactiveFormsModule,
    CardModule,
    LabelModule,
    TranslocoPipe,
    DropDownsModule,
    SVGIconModule,
    DateInputsModule,
    TooltipDirective,
  ],
  templateUrl: './program-selection-filters.component.html',
  styleUrl: './program-selection-filters.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProgramSelectionFiltersComponent {
  filterForm = this.createFormGroup();
  kendoIcons = kendoIcons;
  vetIcons = vetIcons;

  isFilterExpanded = signal(true);
  filteredDistricts = signal<District[]>([]);
  filteredOrganisations = signal<Organisations[]>([]);

  generalsService = inject(GeneralsService);

  filters = input<ProgramSelectionFilter>({});
  filtersChange = output<ProgramSelectionFilter>();

  programTypes$ = rxResource({
    loader: () =>
      this.generalsService
        .getAllConfigs({
          key: 'program_types',
          program_type: 'long-term',
        })
        .pipe(map((res) => res.program_types)),
  });
  financingTypes$ = rxResource({
    loader: () =>
      this.generalsService.getAllConfigs({ key: 'financing_types' }).pipe(map((res) => res.financing_types)),
  });
  regionsRc$ = rxResource({
    loader: () => this.generalsService.getRegionsList().pipe(map((response) => response.data)),
  });
  districtsRc$ = rxResource({
    loader: () => this.generalsService.getDistrictsList().pipe(map((response) => response.data)),
  });
  organisationsRc$ = rxResource({
    loader: () => this.generalsService.getOrganisationsList().pipe(map((response) => response.data)),
  });

  protected readonly destroyRef = inject(DestroyRef);

  constructor() {
    this.watchRegionChanges();
    this.initializeOrganisations();
    effect(() => this.patchIncomingFilters());
  }

  createFormGroup() {
    return new FormGroup({
      search: new FormControl(),
      organisation: new FormControl(),
      program_name: new FormControl(),
      program: new FormControl(),
      program_kind: new FormControl(),
      integrated: new FormControl(),
      financing_type: new FormControl(),
      region: new FormControl(),
      district: new FormControl(),
    });
  }

  initializeOrganisations() {
    effect(() => {
      const allOrganisations = this.organisationsRc$.value();
      if (allOrganisations && this.filteredOrganisations().length === 0) {
        this.filteredOrganisations.set(allOrganisations);
      }
    });
  }

  patchIncomingFilters() {
    const filterValue = {
      ...this.filterForm.value,
      ...this.filters(),
    };
    this.filterForm.patchValue(filterValue ?? {}, { emitEvent: false });
    if (filterValue?.region) {
      this.filterForm.get('region')?.updateValueAndValidity();
    }
  }

  watchRegionChanges() {
    this.filterForm
      .get('region')
      ?.valueChanges.pipe(debounceTime(300), takeUntilDestroyed(this.destroyRef))
      .subscribe((regionId) => this.onRegionSelected(regionId));
  }

  onRegionSelected(regionId: number): void {
    if (regionId !== this.filters()?.region) {
      this.filterForm.get('district')?.reset();
      this.filterForm.get('organisation')?.reset();
    }

    const allDistricts = this.districtsRc$.value() || [];
    const allOrganisations = this.organisationsRc$.value() || [];

    if (!regionId) {
      this.filterForm.get('district')?.disable();
      this.filterForm.get('organisation')?.disable();
      this.filteredDistricts.set([]);
      this.filteredOrganisations.set(allOrganisations);
    } else {
      this.filterForm.get('district')?.enable();
      this.filterForm.get('organisation')?.enable();

      this.filteredDistricts.set(allDistricts.filter((district: District) => district.region_id === regionId));
      this.filteredOrganisations.set(
        allOrganisations.filter((organisation: Organisations) => organisation.region_id === regionId),
      );
    }
  }

  onFilterExpandClick() {
    this.isFilterExpanded.set(!this.isFilterExpanded());
  }

  clearFilters() {
    this.filterForm.reset();

    this.filteredDistricts.set([]);
    const allOrganisations = this.organisationsRc$.value() || [];
    this.filteredOrganisations.set(allOrganisations);

    this.filterForm.get('district')?.disable();
    this.filterForm.get('organisation')?.disable();

    this.filterForm.updateValueAndValidity();
    this.onSubmit();
  }

  onSubmit() {
    const value = this.filterForm.value;

    const filterData: ProgramSelectionFilter = {
      search: value.search ?? null,
      organisation: value.organisation ?? null,
      program_name: value.program_name ?? null,
      program: value.program ?? null,
      program_kind: value.program_kind ?? null,
      integrated: value.integrated ?? null,
      financing_type: value.financing_type ?? null,
      region: value?.region ?? null,
      district: value.district ?? null,
    };

    this.filtersChange.emit(filterData);
  }
}
