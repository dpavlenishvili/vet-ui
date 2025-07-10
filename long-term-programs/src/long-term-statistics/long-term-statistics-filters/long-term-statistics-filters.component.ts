import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import {
  ButtonComponent,
  IconButtonComponent,
  SelectorComponent,
  vetIcons,
  VetSwitchComponent,
  withoutEmptyProperties,
} from '@vet/shared';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { TranslocoPipe } from '@jsverse/transloco';
import { InputsModule } from '@progress/kendo-angular-inputs';
import { CommissionReviewFilters } from 'long-term-programs/src/commission-results/commission-results.component';
import { StatisticsFilters } from '../long-term-statistics.component';
import { usePrograms } from 'long-term-programs/src/long-term.resources';
import { useProgramKinds } from '@vet/shared-resources';

@Component({
  selector: 'vet-long-term-statistics-filters',
  imports: [
    SelectorComponent,
    TranslocoPipe,
    ReactiveFormsModule,
    InputsModule,
    VetSwitchComponent,
    ButtonComponent,
    IconButtonComponent,
  ],
  templateUrl: './long-term-statistics-filters.component.html',
  styleUrl: './long-term-statistics-filters.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LongTermStatisticsFiltersComponent {
  numberOfRecords = input<number>();
  filters = input.required<StatisticsFilters>();
  filtersChange = output<StatisticsFilters>();

  programsOptions = usePrograms();
  ProgramKindsOptions = useProgramKinds('long-term');

  vetIcons = vetIcons;
  filterForm = this.createFilterForm();

  createFilterForm() {
    return new FormGroup({
      program: new FormControl(),
      kind: new FormControl(),
      integrated: new FormControl(),
    });
  }

  clearFilters() {
    this.filterForm.reset();
    this.filterForm.updateValueAndValidity();
    this.onSubmit();
  }

  onSubmit() {
    this.filtersChange.emit(withoutEmptyProperties(this.filterForm.value) as CommissionReviewFilters);
  }
}
