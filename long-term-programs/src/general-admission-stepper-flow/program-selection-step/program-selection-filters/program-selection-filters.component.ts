import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { AsyncPipe } from '@angular/common';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { TranslocoPipe } from '@jsverse/transloco';
import { ButtonModule } from '@progress/kendo-angular-buttons';
import { DropDownsModule } from '@progress/kendo-angular-dropdowns';
import { SVGIconModule } from '@progress/kendo-angular-icons';
import { InputsModule } from '@progress/kendo-angular-inputs';
import { LabelModule } from '@progress/kendo-angular-label';
import { CardModule } from '@progress/kendo-angular-layout';
import * as kendoIcons from '@progress/kendo-svg-icons';
import { GeneralsService } from '@vet/backend';
import { map } from 'rxjs';

@Component({
  selector: 'vet-program-selection-filters',
  imports: [
    InputsModule,
    ButtonModule,
    ReactiveFormsModule,
    CardModule,
    LabelModule,
    TranslocoPipe,
    DropDownsModule,
    SVGIconModule,
    AsyncPipe,
  ],
  templateUrl: './program-selection-filters.component.html',
  styleUrl: './program-selection-filters.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
})
export class ProgramSelectionFiltersComponent {
  filterForm = this.createFormGroup();
  kendoIcons = kendoIcons;
  isFilterExpanded = false;

  programForms = ['dual', 'imitated', 'cooperative', 'modular'];
  financing = ['yes', 'no', 'partly'];

  generalsService = inject(GeneralsService);

  districts$ = this.generalsService.getDistrictsList().pipe(map((response) => response.data));
  regions$ = this.generalsService.getRegionsList().pipe(map((response) => response.data));

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
}
