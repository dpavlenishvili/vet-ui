import {ChangeDetectionStrategy, Component, inject, input, output} from '@angular/core';
import {ButtonComponent} from '@progress/kendo-angular-buttons';
import {FormControl, FormGroup, FormsModule, ReactiveFormsModule} from '@angular/forms';
import * as kendoIcons from '@progress/kendo-svg-icons';
import {TranslocoPipe, TranslocoService} from '@jsverse/transloco';
import {AdmissionListFilter} from '../admissions-list-admin.component';
import {TextBoxComponent} from '@progress/kendo-angular-inputs';
import {DropDownListComponent, ItemTemplateDirective, ValueTemplateDirective,} from '@progress/kendo-angular-dropdowns';

@Component({
  selector: 'vet-admissions-list-admin-filters',
  templateUrl: './admissions-list-admin-filters.component.html',
  styleUrl: './admissions-list-admin-filters.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [
    ButtonComponent,
    FormsModule,
    ReactiveFormsModule,
    TranslocoPipe,
    TextBoxComponent,
    DropDownListComponent,
    ValueTemplateDirective,
    ItemTemplateDirective,
  ],
})
export class AdmissionsListAdminFiltersComponent {
  itemsCount = input(0);
  filtersChange = output<AdmissionListFilter>();

  translocoService = inject(TranslocoService);
  filterForm = this.createFormGroup();
  kendoIcons = kendoIcons;
  institutionPlaceholder = {
    value: null,
    label: this.translocoService.translate('programs.institution'),
  };
  statusPlaceholder = {
    value: null,
    label: this.translocoService.translate('programs.status'),
  };
  ssmStatusPlaceholder = {
    value: null,
    label: this.translocoService.translate('programs.ssm_status'),
  };

  createFormGroup() {
    return new FormGroup({
      pid: new FormControl(''),
      first_name: new FormControl(''),
      last_name: new FormControl(''),
      institution_id: new FormControl(null),
      status: new FormControl(null),
      ssm_status: new FormControl(null),
    });
  }

  clearFilters() {
    this.filterForm.reset();
    this.onSubmit();
  }

  onSubmit() {
    const value = this.filterForm.value;
    this.filtersChange.emit({ ...value });
  }
}
