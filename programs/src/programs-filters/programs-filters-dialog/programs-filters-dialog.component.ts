import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { TranslocoPipe } from '@jsverse/transloco';
import { ButtonModule } from '@progress/kendo-angular-buttons';
import { DialogModule } from '@progress/kendo-angular-dialog';
import { DropDownListModule } from '@progress/kendo-angular-dropdowns';
import { InputsModule, TextAreaModule, TextBoxModule } from '@progress/kendo-angular-inputs';
import { ToastModule } from '@vet/shared';
import * as kendoIcons from '@progress/kendo-svg-icons';
import { LabelModule } from '@progress/kendo-angular-label';
import { SVGIconModule } from '@progress/kendo-angular-icons';
import { JsonPipe } from '@angular/common';

@Component({
  selector: 'vet-programs-filters-dialog',
  imports: [
    TranslocoPipe,
    DialogModule,
    ReactiveFormsModule,
    DropDownListModule,
    TextBoxModule,
    ButtonModule,
    ToastModule,
    TextAreaModule,
    LabelModule,
    InputsModule,
    SVGIconModule,
    JsonPipe
  ],
  templateUrl: './programs-filters-dialog.component.html',
  styleUrl: './programs-filters-dialog.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true
})
export class ProgramsFiltersDialogComponent {
  kendoIcons = kendoIcons;
  isFilterExpanded = false;
  isFilterDialogOpen = false;
  filterKeys = ['program', 'organisation_id', 'program_name', 'integrated'];
  durationDropdownValues = ['1-3', '3-6', '6-9', '9-12', '12-15'];

  filters = input(<any>[]);
  filterForm = input<FormGroup>()
  dialogClose = output();

  handleSave() {
    this.filterForm()?.value
  }

  mapFilters() {
    return this.filters()
      .filter((filter: any) => this.filterKeys.includes(filter.key))
      .sort((a: any, b: any) => this.filterKeys.indexOf(a.key) - this.filterKeys.indexOf(b.key));
  }

  handleClose() {
    this.dialogClose.emit();
  }
}
