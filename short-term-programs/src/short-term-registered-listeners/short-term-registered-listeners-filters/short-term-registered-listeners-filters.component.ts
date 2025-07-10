import { ChangeDetectionStrategy, Component, effect, input, output } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { TranslocoPipe } from '@jsverse/transloco';
import {
  ButtonComponent,
  DatePickerComponent,
  IconButtonComponent,
  InputComponent,
  SelectorComponent,
  vetIcons,
  withoutEmptyProperties,
} from '@vet/shared';
import { ShortTermRegisteredListenersFilters } from '../../short-term-programs.types';
import { useInstitutionsDictionary } from '@vet/shared-resources';

@Component({
  selector: 'vet-short-term-registered-listeners-filters',
  imports: [
    SelectorComponent,
    ReactiveFormsModule,
    TranslocoPipe,
    InputComponent,
    ButtonComponent,
    IconButtonComponent,
    DatePickerComponent,
  ],
  templateUrl: './short-term-registered-listeners-filters.component.html',
  styleUrl: './short-term-registered-listeners-filters.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ShortTermRegisteredListenersFiltersComponent {
  numberOfRecords = input.required<number>();
  filters = input.required<ShortTermRegisteredListenersFilters>();
  filtersChange = output<ShortTermRegisteredListenersFilters>();

  vetIcons = vetIcons;
  formGroup = this.createFormGroup();

  institutionOptions = useInstitutionsDictionary();

  constructor() {
    effect(() => {
      this.formGroup.patchValue(this.filters());
    });
  }

  createFormGroup() {
    return new FormGroup({
      organisation_name: new FormControl<string | null>(null),
      program_name_or_code: new FormControl(''),
      tuition_start_date: new FormControl<string | null>(null),
    });
  }

  onSubmit() {
    this.filtersChange.emit(withoutEmptyProperties(this.formGroup.value) as ShortTermRegisteredListenersFilters);
  }

  onClearClick() {
    this.formGroup.patchValue({
      organisation_name: '',
      program_name_or_code: '',
      tuition_start_date: null,
    });
    this.formGroup.updateValueAndValidity();
    this.onSubmit();
  }
}
