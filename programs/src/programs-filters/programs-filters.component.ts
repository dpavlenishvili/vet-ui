import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { InputsModule } from '@progress/kendo-angular-inputs';
import { ButtonModule } from '@progress/kendo-angular-buttons';
import { CardModule } from '@progress/kendo-angular-layout';
import { LabelModule } from '@progress/kendo-angular-label';
import * as kendoIcons from '@progress/kendo-svg-icons';
import { TranslocoPipe } from '@jsverse/transloco';
import { ProgramsFiltersDialogComponent } from './programs-filters-dialog/programs-filters-dialog.component';
import { DropDownsModule } from '@progress/kendo-angular-dropdowns';
import { SVGIconModule } from '@progress/kendo-angular-icons';

@Component({
  selector: 'vet-programs-filters',
  imports: [
    InputsModule,
    ButtonModule,
    ReactiveFormsModule,
    CardModule,
    LabelModule,
    TranslocoPipe,
    ProgramsFiltersDialogComponent,
    DropDownsModule,
    SVGIconModule,
  ],
  templateUrl: './programs-filters.component.html',
  styleUrl: './programs-filters.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
})
export class ProgramsFiltersComponent {
  filterForm = this.createFormGroup();
  kendoIcons = kendoIcons;
  isFilterExpanded = false;
  isFilterDialogOpen = false;
  filters = input(<any>[]);
  filterKeys = ['program', 'organisation_id', 'program_name', 'integrated'];
  formDropdownValues = ['dual', 'simulated', 'cooperative', 'modular'];
  durationDropdownValues = ['1-3', '3-6', '6-9', '9-12', '12-15'];

  filtersChange = output<typeof this.filterForm.value>();

  createFormGroup() {
    return new FormGroup({
      program: new FormControl(),
      organisation_id: new FormControl(),
      program_name: new FormControl(),
      form: new FormControl(),
      duration: new FormControl(),
      integrated: new FormControl(),
      financing_type: new FormControl(),
      region: new FormControl(),
      district: new FormControl(),
    });
  }

  mapFilters() {
    return this.filters()
      .filter((filter: any) => this.filterKeys.includes(filter.key))
      .sort((a: any, b: any) => this.filterKeys.indexOf(a.key) - this.filterKeys.indexOf(b.key));
  }

  clearFilters() {
    this.filterForm.reset();
  }

  onFilterExpandClick() {
    this.isFilterExpanded = !this.isFilterExpanded;
  }

  onSubmit() {
    this.filtersChange.emit(this.filterForm.value);
  }

  openDialog() {
    this.isFilterDialogOpen = true;
  }

  closeDialog() {
    this.isFilterDialogOpen = false;
  }
}
