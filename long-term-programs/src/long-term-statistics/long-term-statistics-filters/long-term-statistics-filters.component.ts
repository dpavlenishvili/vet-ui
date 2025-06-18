import { ChangeDetectionStrategy, Component, effect, inject, input, output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SelectorComponent, VetSwitchComponent, vetIcons, withoutEmptyProperties } from '@vet/shared';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { TranslocoPipe } from '@jsverse/transloco';
import { KENDO_BUTTON } from '@progress/kendo-angular-buttons';
import { KENDO_DIALOG } from '@progress/kendo-angular-dialog';
import { KENDO_GRID } from '@progress/kendo-angular-grid';
import { InputsModule } from '@progress/kendo-angular-inputs';
import { GeneralsService } from '@vet/backend';
import { CommissionReviewFilters } from 'long-term-programs/src/commission-results/commission-results.component';
import { StatisticsFilters } from '../long-term-statistics.component';
import { usePrograms, useProgramKinds } from 'long-term-programs/src/long-term.resources';

@Component({
  selector: 'vet-long-term-statistics-filters',
  imports: [
    CommonModule,
    SelectorComponent,
    KENDO_DIALOG,
    TranslocoPipe,
    ReactiveFormsModule,
    InputsModule,
    KENDO_BUTTON,
    KENDO_GRID,
    VetSwitchComponent
  ],
  templateUrl: './long-term-statistics-filters.component.html',
  styleUrl: './long-term-statistics-filters.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LongTermStatisticsFiltersComponent {
  numberOfRecords = input<number>();
  filters = input.required<StatisticsFilters>();
  filtersChange = output<StatisticsFilters>();

  generalsService = inject(GeneralsService);
  programsOptions = usePrograms();
  ProgramKindsOptions = useProgramKinds();

  vetIcons = vetIcons;
  filterForm = this.createFilterForm();

  createFilterForm() {
    return new FormGroup({
      program: new FormControl(),
      kind: new FormControl(),
      integrated: new FormControl(),
    });
  }

  clearFilters() {
    this.filterForm.reset();
    this.filterForm.updateValueAndValidity();
    this.onSubmit();
  }

  onSubmit() {
    this.filtersChange.emit(withoutEmptyProperties(this.filterForm.value) as CommissionReviewFilters);
  }
}
