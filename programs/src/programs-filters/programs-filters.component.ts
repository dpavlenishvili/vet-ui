import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { InputsModule } from '@progress/kendo-angular-inputs';
import { ButtonModule } from '@progress/kendo-angular-buttons';
import { CardModule } from '@progress/kendo-angular-layout';
import { LabelModule } from '@progress/kendo-angular-label';
import * as kendoIcons from '@progress/kendo-svg-icons';
import { TranslocoModule } from '@jsverse/transloco';
import { ProgramsFiltersDialogComponent } from './programs-filters-dialog/programs-filters-dialog.component';
import { DropDownsModule } from '@progress/kendo-angular-dropdowns';
import { SVGIconModule } from '@progress/kendo-angular-icons';

@Component({
  selector: 'vet-programs-filters',
  imports: [
    CommonModule,
    InputsModule,
    ButtonModule,
    ReactiveFormsModule,
    CardModule,
    LabelModule,
    TranslocoModule,
    ProgramsFiltersDialogComponent,
    DropDownsModule,
    SVGIconModule,
  ],
  templateUrl: './programs-filters.component.html',
  styleUrl: './programs-filters.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProgramsFiltersComponent {
  filterForm = this.createFormGroup();
  kendoIcons = kendoIcons;
  isFilterExpanded = false;
  isFilterDialogOpen = false;

  createFormGroup() {
    return new FormGroup({
      name: new FormControl(),
      size: new FormControl(),
      sector: new FormControl(),
    });
  }

  clearFilters() {
    this.filterForm.reset();
  }

  onFilterExpandClick() {
    this.isFilterExpanded = !this.isFilterExpanded;
  }

  onSubmit() {
    console.log(this.filterForm.value);
  }

  openDialog() {
    this.isFilterDialogOpen = true;
  }

  closeDialog() {
    this.isFilterDialogOpen = false;
  }
}
