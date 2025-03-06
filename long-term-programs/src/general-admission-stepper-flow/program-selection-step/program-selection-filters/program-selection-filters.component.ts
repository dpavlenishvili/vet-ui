import { vetIcons } from '@vet/shared';
import { ChangeDetectionStrategy, Component, inject, output } from '@angular/core';
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
import { ProgramSelectionFilter } from '../program-selection-step.component';

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
  vetIcons = vetIcons;
  isFilterExpanded = false;

  programForms = ['dual', 'imitated', 'cooperative', 'modular'];
  financing = ['yes', 'no', 'partly'];

  generalsService = inject(GeneralsService);

  filtersChange = output<ProgramSelectionFilter>();

  districts$ = this.generalsService.getDistrictsList().pipe(map((response) => response.data));
  regions$ = this.generalsService.getRegionsList().pipe(map((response) => response.data));
  organisations$ = this.generalsService.getOrganisationsList().pipe(map((response) => response.data));

  createFormGroup() {
    return new FormGroup({
      organisation: new FormControl(),
      program_name: new FormControl(),
      program: new FormControl(),
      duration: new FormControl(),
      integrated: new FormControl(),
      financing_type: new FormControl(),
      region: new FormControl(),
      district: new FormControl(),
    });
  }

  clearFilters() {
    this.filterForm.reset();
    this.onSubmit();
  }

  onFilterExpandClick() {
    this.isFilterExpanded = !this.isFilterExpanded;
  }

  onSubmit() {
    const value = this.filterForm.value;

    const filterData: ProgramSelectionFilter['filters'] = {
      organisation: value.organisation ?? null,
      program_name: value.program_name ?? null,
      program: value.program ?? null,
      duration: value.duration ?? null,
      integrated: value.integrated ?? null,
      financing_type: value.financing_type ?? null,
      region: value.region ?? null,
      district: value.district ?? null,
    };

    this.filtersChange.emit({ filters: filterData });
  }
}
