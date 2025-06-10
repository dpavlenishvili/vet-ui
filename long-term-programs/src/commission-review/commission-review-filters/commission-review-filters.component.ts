import { ChangeDetectionStrategy, Component, inject, input, output } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { TranslocoPipe } from '@jsverse/transloco';
import { KENDO_BUTTON } from '@progress/kendo-angular-buttons';
import { KENDO_DROPDOWNLIST } from '@progress/kendo-angular-dropdowns';
import { KENDO_SVGICON } from '@progress/kendo-angular-icons';
import { KENDO_TEXTBOX, KENDO_SWITCH } from '@progress/kendo-angular-inputs';
import { KENDO_POPOVER } from '@progress/kendo-angular-tooltip';
import { vetIcons } from '@vet/shared';
import { GeneralsService } from '@vet/backend';
import { ReviewFilters } from '../commission-review.component';

@Component({
  selector: 'vet-commission-review-filters',
  imports: [
    KENDO_TEXTBOX,
    KENDO_DROPDOWNLIST,
    KENDO_BUTTON,
    KENDO_SWITCH,
    KENDO_SVGICON,
    KENDO_POPOVER,
    ReactiveFormsModule,
    TranslocoPipe,
  ],
  templateUrl: './commission-review-filters.component.html',
  styleUrl: './commission-review-filters.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CommissionReviewFiltersComponent {
  vetIcons = vetIcons;

  numberOfRecords = input<number>();
  filtersChange = output<ReviewFilters>();

  filterForm = this.createFilterForm();

  generalsService = inject(GeneralsService);

  createFilterForm() {
    return new FormGroup({
      program: new FormControl(),
      pid: new FormControl(),
      fullname: new FormControl(),
    });
  }

  clearFilters() {
    this.filterForm.reset();
    this.filterForm.updateValueAndValidity();
    this.onSubmit();
  }

  onSubmit() {
    const value = this.filterForm.value;

    const filterData: ReviewFilters = {
      program: value.program ?? null,
      pid: value.pid ?? null,
      fullname: value.fullname ?? null,
    };

    this.filtersChange.emit(filterData);
  }
}
