import { ButtonComponent, IconButtonComponent, InputComponent, vetIcons } from '@vet/shared';
import { ChangeDetectionStrategy, Component, output } from '@angular/core';
import { TranslocoPipe } from '@jsverse/transloco';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { ExamCardFilters } from '../exam-card-search.component';

@Component({
  selector: 'vet-exam-card-filter',
  imports: [TranslocoPipe, ReactiveFormsModule, InputComponent, IconButtonComponent, ButtonComponent],
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
