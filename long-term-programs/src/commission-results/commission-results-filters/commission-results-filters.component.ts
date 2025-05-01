import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { InputsModule } from '@progress/kendo-angular-inputs';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { TranslocoPipe } from '@jsverse/transloco';
import { KENDO_BUTTON } from '@progress/kendo-angular-buttons';
import { KENDO_DIALOG } from '@progress/kendo-angular-dialog';
import { KENDO_GRID } from '@progress/kendo-angular-grid';
import { KENDO_DROPDOWNLIST } from '@progress/kendo-angular-dropdowns';
import { CommissionReviewFilters, ResultFilters } from '../commission-results.component';
import { vetIcons } from '@vet/shared';

@Component({
  selector: 'vet-commission-results-filters',
  imports: [
    KENDO_DIALOG,
    TranslocoPipe,
    ReactiveFormsModule,
    InputsModule,
    KENDO_BUTTON,
    KENDO_GRID,
    KENDO_DROPDOWNLIST,
  ],
  templateUrl: './commission-results-filters.component.html',
  styleUrl: './commission-results-filters.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CommissionResultsFiltersComponent {
  filters = input<ResultFilters[]>();
  filtersChange = output<CommissionReviewFilters>();

  vetIcons = vetIcons;
  filterForm = this.createFormGroup();

  createFormGroup() {
    return new FormGroup({
      fullname: new FormControl<string | null>(null),
      pid: new FormControl<string | null>(null),
      program: new FormControl<string | null>(null),
    });
  }

  clearFilters() {
    this.filterForm.reset();
    this.onSubmit();
  }

  onSubmit() {
    const value = this.filterForm.value;
    const filterData: CommissionReviewFilters['filters'] = {
      program: value.program ?? null,
      pid: value.pid ?? null,
      fullname: value.fullname ?? null,
    };

    this.filtersChange.emit({ filters: filterData });
  }
}
