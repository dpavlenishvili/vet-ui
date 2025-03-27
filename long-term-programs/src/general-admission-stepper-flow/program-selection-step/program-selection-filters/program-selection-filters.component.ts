import { District, vetIcons } from '@vet/shared';
import { ChangeDetectionStrategy, Component, DestroyRef, inject, output, signal } from '@angular/core';
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
import { map, tap } from 'rxjs/operators';
import { ProgramSelectionFilter } from '../program-selection-step.component';
import { DateInputsModule } from '@progress/kendo-angular-dateinputs';
import { rxResource, takeUntilDestroyed } from '@angular/core/rxjs-interop';

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
  ],
  templateUrl: './program-selection-filters.component.html',
  styleUrl: './program-selection-filters.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProgramSelectionFiltersComponent {
  filterForm = this.createFormGroup();
  kendoIcons = kendoIcons;
  vetIcons = vetIcons;

  isFilterExpanded = signal(false);
  filteredDistricts = signal<District[]>([]);

  programForms: string[] = ['dual', 'imitated', 'cooperative', 'modular'];
  financing: string[] = ['yes', 'no', 'partly'];

  generalsService = inject(GeneralsService);

  filtersChange = output<ProgramSelectionFilter>();

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
    this.filterForm
      .get('region')
      ?.valueChanges.pipe(
        tap((region: string | null) => {
          this.filterForm.get('district')?.reset();
          if (!region) {
            this.filterForm.get('district')?.disable();
            this.filteredDistricts.set([]);
          } else {
            this.filterForm.get('district')?.enable();
            const allDistricts = this.districtsRc$.value() || [];
            this.filteredDistricts.set(allDistricts.filter((district: District) => district.region_name === region));
          }
        }),
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe();
  }

  createFormGroup() {
    return new FormGroup({
      filter: new FormControl<string | null>(null),
      organisation: new FormControl<string | null>(null),
      program_name: new FormControl<string | null>(null),
      program: new FormControl<string | null>(null),
      program_kind: new FormControl<string | null>(null),
      integrated: new FormControl<boolean | null>(null),
      financing_type: new FormControl<string | null>(null),
      region: new FormControl<string | null>(null),
      district: new FormControl<string | null>(null),
    });
  }

  clearFilters() {
    this.filterForm.reset();
    this.onSubmit();
  }

  onFilterExpandClick() {
    this.isFilterExpanded.set(!this.isFilterExpanded());
  }

  onSubmit() {
    const value = this.filterForm.value;
    const filterData: ProgramSelectionFilter['filters'] = {
      filter: value.filter ?? null,
      organisation: value.organisation ?? null,
      program_name: value.program_name ?? null,
      program: value.program ?? null,
      program_kind: value.program_kind ?? null,
      integrated: value.integrated ?? null,
      financing_type: value.financing_type ?? null,
      region: value.region ?? null,
      district: value.district ?? null,
    };

    this.filtersChange.emit({ filters: filterData });
  }
}
