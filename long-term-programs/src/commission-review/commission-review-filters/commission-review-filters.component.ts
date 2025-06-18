import { ChangeDetectionStrategy, Component, effect, inject, input, output } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { TranslocoPipe } from '@jsverse/transloco';
import { KENDO_BUTTON } from '@progress/kendo-angular-buttons';
import { KENDO_DROPDOWNLIST } from '@progress/kendo-angular-dropdowns';
import { KENDO_SVGICON } from '@progress/kendo-angular-icons';
import { KENDO_TEXTBOX, KENDO_SWITCH } from '@progress/kendo-angular-inputs';
import { KENDO_POPOVER } from '@progress/kendo-angular-tooltip';
import { SelectorComponent, vetIcons, withoutEmptyProperties } from '@vet/shared';
import { ReviewFilters } from '../commission-review.component';
import { usePrograms } from 'long-term-programs/src/long-term.resources';

@Component({
  selector: 'vet-commission-review-filters',
  imports: [
    KENDO_TEXTBOX,
    KENDO_DROPDOWNLIST,
    KENDO_BUTTON,
    KENDO_SWITCH,
    KENDO_SVGICON,
    KENDO_POPOVER,
    SelectorComponent,
    ReactiveFormsModule,
    TranslocoPipe,
  ],
  templateUrl: './commission-review-filters.component.html',
  styleUrl: './commission-review-filters.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CommissionReviewFiltersComponent {
  numberOfRecords = input<number>();
  filters = input.required<ReviewFilters>();
  filtersChange = output<ReviewFilters>();

  vetIcons = vetIcons;
  filterForm = this.createFilterForm();

  programsOptions = usePrograms();

  constructor() {
    effect(() => {
      this.filterForm.patchValue(this.filters());
    });
  }

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
    this.filtersChange.emit(
      withoutEmptyProperties(this.filterForm.value) as ReviewFilters
    )
  }

}
