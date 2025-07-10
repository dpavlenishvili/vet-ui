import { ButtonComponent, IconButtonComponent, InputComponent, vetIcons } from '@vet/shared';
import { ChangeDetectionStrategy, Component, output } from '@angular/core';
import { TranslocoPipe } from '@jsverse/transloco';
import { FormGroup, FormControl, ReactiveFormsModule } from '@angular/forms';
import { KENDO_BUTTON } from '@progress/kendo-angular-buttons';
import { KENDO_GRID } from '@progress/kendo-angular-grid';
import { KENDO_TEXTBOX } from '@progress/kendo-angular-inputs';
import { ExamCardFilters } from '../exam-card.component';

@Component({
  selector: 'vet-exam-card-filter',
  imports: [
    TranslocoPipe,
    ReactiveFormsModule,
    KENDO_BUTTON,
    KENDO_GRID,
    KENDO_TEXTBOX,
    InputComponent,
    IconButtonComponent,
    ButtonComponent,
  ],
  templateUrl: './exam-card-filter.component.html',
  styleUrl: './exam-card-filter.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ExamCardFilterComponent {
  filterForm = this.createFormGroup();
  vetIcons = vetIcons;
  filtersChange = output<ExamCardFilters>();

  createFormGroup() {
    return new FormGroup({
      pid: new FormControl(),
    });
  }

  clearFilters() {
    this.filterForm.reset();
    this.onSubmit();
  }

  onSubmit() {
    const filterValue = this.filterForm.value;

    this.filtersChange.emit({
      filters: filterValue,
    });
  }
}
