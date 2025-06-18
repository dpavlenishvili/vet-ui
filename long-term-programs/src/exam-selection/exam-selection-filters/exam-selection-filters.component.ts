import { ChangeDetectionStrategy, Component, effect, inject, input, output } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { TranslocoPipe } from '@jsverse/transloco';
import { KENDO_BUTTON } from '@progress/kendo-angular-buttons';
import { KENDO_DROPDOWNLIST } from '@progress/kendo-angular-dropdowns';
import { KENDO_SVGICON } from '@progress/kendo-angular-icons';
import { KENDO_SWITCH, KENDO_TEXTBOX } from '@progress/kendo-angular-inputs';
import { KENDO_POPOVER } from '@progress/kendo-angular-tooltip';
import { SelectorComponent, VetSwitchComponent, vetIcons } from '@vet/shared';
import { SchedulesFilters } from '../exam-selection.component';
import { useInstitutionsDictionary, usePrograms } from 'long-term-programs/src/long-term.resources';

@Component({
  selector: 'vet-exam-selection-filters',
  imports: [
    KENDO_TEXTBOX,
    KENDO_DROPDOWNLIST,
    KENDO_BUTTON,
    KENDO_SWITCH,
    KENDO_SVGICON,
    KENDO_POPOVER,
    SelectorComponent,
    VetSwitchComponent,
    ReactiveFormsModule,
    TranslocoPipe,
  ],
  templateUrl: './exam-selection-filters.component.html',
  styleUrl: './exam-selection-filters.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ExamSelectionFiltersComponent {
  vetIcons = vetIcons;

  numberOfRecords = input<number>();
  filters = input.required<SchedulesFilters>();
  filtersChange = output<SchedulesFilters>();

  filterForm = this.createFilterForm();

  programsOptions = usePrograms();
  institutionOptions = useInstitutionsDictionary();

  constructor() {
    effect(() => {
      this.filterForm.patchValue(this.filters());
    });
  }

  createFilterForm() {
    return new FormGroup({
      program: new FormControl(),
      pid: new FormControl(),
      organisation: new FormControl(),
      spec: new FormControl(),
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

    const filterData: SchedulesFilters = {
      program: value.program ?? null,
      pid: value.pid ?? null,
      organisation: value.organisation ?? null,
      spec: value.spec ?? null,
      fullname: value.fullname ?? null,
    };

    this.filtersChange.emit(filterData);
  }
}
