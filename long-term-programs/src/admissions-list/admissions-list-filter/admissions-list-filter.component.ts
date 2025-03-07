import { ChangeDetectionStrategy, Component, output } from '@angular/core';
import { ButtonComponent } from '@progress/kendo-angular-buttons';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import * as kendoIcons from '@progress/kendo-svg-icons';
import { TranslocoPipe } from '@jsverse/transloco';
import { AdmissionListFilter } from '../admissions-list.component';
import { TextBoxComponent } from '@progress/kendo-angular-inputs';

@Component({
  selector: 'vet-admissions-list-filter',
  standalone: true,
  templateUrl: './admissions-list-filter.component.html',
  styleUrl: './admissions-list-filter.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    ButtonComponent,
    FormsModule,
    ReactiveFormsModule,
    TranslocoPipe,
    TextBoxComponent,
  ],
})
export class AdmissionsListFilterComponent {
  filterForm = this.createFormGroup();
  kendoIcons = kendoIcons;
  filtersChange = output<AdmissionListFilter>();

  createFormGroup() {
    return new FormGroup({
      number: new FormControl(),
      date: new FormControl(),
      status: new FormControl(),
      organisation: new FormControl(),
    });
  }

  clearFilters() {
    this.filterForm.reset();
    this.onSubmit();
  }

  onSubmit() {
    const value = this.filterForm.value;

    const filterData: AdmissionListFilter = {
      date: value.date ?? null,
      status: value.status ?? null,
    };

    this.filtersChange.emit({ ...filterData });
  }
}
