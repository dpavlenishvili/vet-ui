import { ChangeDetectionStrategy, Component, effect, inject, input, output } from '@angular/core';
import { InputsModule } from '@progress/kendo-angular-inputs';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { TranslocoPipe } from '@jsverse/transloco';
import { KENDO_BUTTON } from '@progress/kendo-angular-buttons';
import { KENDO_DIALOG } from '@progress/kendo-angular-dialog';
import { KENDO_GRID } from '@progress/kendo-angular-grid';
import { KENDO_DROPDOWNLIST } from '@progress/kendo-angular-dropdowns';
import { vetIcons, withoutEmptyProperties } from '@vet/shared';
import { GeneralsService } from '@vet/backend';
import { rxResource } from '@angular/core/rxjs-interop';
import { map, filter } from 'rxjs';
import { CommissionReviewFilters } from '../commission-results.component';

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
  numberOfRecords = input<number>();
  filters = input.required<CommissionReviewFilters>();
  filtersChange = output<CommissionReviewFilters>();

  generalsService = inject(GeneralsService);

  vetIcons = vetIcons;
  filterForm = this.createFilterForm();

  organisationsRc$ = rxResource({
    loader: () => this.generalsService.getOrganisationsList().pipe(map((response) => response.data)),
  });

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
      withoutEmptyProperties(this.filterForm.value) as CommissionReviewFilters
    )
  }

}
