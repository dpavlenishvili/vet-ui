import { ChangeDetectionStrategy, Component, output } from '@angular/core';
import { AsyncPipe } from '@angular/common';
import { ButtonComponent } from '@progress/kendo-angular-buttons';
import { DropDownListComponent } from '@progress/kendo-angular-dropdowns';
import { FloatingLabelComponent } from '@progress/kendo-angular-label';
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
    AsyncPipe,
    ButtonComponent,
    DropDownListComponent,
    FloatingLabelComponent,
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
