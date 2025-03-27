import { ChangeDetectionStrategy, Component, output } from '@angular/core';
import { ButtonComponent } from '@progress/kendo-angular-buttons';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import * as kendoIcons from '@progress/kendo-svg-icons';
import { TranslocoPipe } from '@jsverse/transloco';
import { AdmissionListFilter } from '../admissions-list.component';
import { TextBoxComponent } from '@progress/kendo-angular-inputs';
import { DatePickerComponent } from '@progress/kendo-angular-dateinputs';
import { LabelComponent } from '@progress/kendo-angular-label';
import { formatDate } from '@vet/shared';

@Component({
  selector: 'vet-admissions-list-filter',
  templateUrl: './admissions-list-filter.component.html',
  styleUrl: './admissions-list-filter.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    ButtonComponent,
    FormsModule,
    ReactiveFormsModule,
    TranslocoPipe,
    TextBoxComponent,
    DatePickerComponent,
    LabelComponent,
  ],
})
export class AdmissionsListFilterComponent {
  filterForm = this.createFormGroup();
  kendoIcons = kendoIcons;
  filtersChange = output<AdmissionListFilter>();

  createFormGroup() {
    return new FormGroup({
      search: new FormControl(),
      date: new FormGroup({
        start: new FormControl(null),
        end: new FormControl(null),
      }),
      status: new FormControl(),
    });
  }

  clearFilters() {
    this.filterForm.reset();
    this.onSubmit();
  }

  onSubmit() {
    const value = this.filterForm.value;
    let durationStr: string | null = null;
    if (value.date?.start && value.date?.end) {
      durationStr = `${formatDate(value.date.start)} - ${formatDate(value.date.end)}`;
    }
    const filterData: AdmissionListFilter = {
      date: durationStr ?? null,
      status: value.status ?? null,
    };

    this.filtersChange.emit({ ...filterData });
  }
}
