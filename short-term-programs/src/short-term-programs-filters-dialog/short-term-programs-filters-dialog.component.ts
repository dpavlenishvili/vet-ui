import { ChangeDetectionStrategy, Component, effect, input, output, ResourceRef } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import {
  DatePickerComponent,
  DialogComponent,
  SelectorComponent, useControlValue, useDebounceValue,
  vetIcons,
  VetSwitchComponent,
  withoutEmptyProperties
} from '@vet/shared';
import { TranslocoPipe } from '@jsverse/transloco';
import { ButtonComponent } from '@progress/kendo-angular-buttons';
import {
  useDistricts,
  useFinancingTypes,
  useInstitutionsDictionary, usePartners,
  useProgramKinds,
  useRegions
} from '../short-term.resources';
import { ShortTermProgramFilters } from '../short-term-programs.types';
import { SVGIconComponent } from '@progress/kendo-angular-icons';
import { TextBoxComponent, TextBoxSuffixTemplateDirective } from '@progress/kendo-angular-inputs';

@Component({
  selector: 'vet-short-term-programs-filters-dialog',
  imports: [
    ReactiveFormsModule,
    TranslocoPipe,
    ButtonComponent,
    FormsModule,
    DialogComponent,
    SVGIconComponent,
    TextBoxComponent,
    TextBoxSuffixTemplateDirective,
    SelectorComponent,
    VetSwitchComponent,
    DatePickerComponent,
  ],
  templateUrl: './short-term-programs-filters-dialog.component.html',
  styleUrl: './short-term-programs-filters-dialog.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
})
export class ShortTermProgramsFiltersDialogComponent {
  filters = input.required<ShortTermProgramFilters>();
  foundResultsCount = input.required<ResourceRef<number | null>>();
  filtersChange = output<ShortTermProgramFilters>();
  filtersChangeRealtime = output<ShortTermProgramFilters>();
  dialogClose = output();

  formGroup = this.createFormGroup();
  institutionOptions = useInstitutionsDictionary();
  regionOptions = useRegions();
  districtOptions = useDistricts();
  programKindOptions = useProgramKinds();
  financingTypeOptions = useFinancingTypes();
  partnerOptions = usePartners();
  formValue = useControlValue(this.formGroup);
  debouncedFormValue = useDebounceValue<ShortTermProgramFilters>(
    this.formValue,
    300,
    (a, b) => JSON.stringify(a) === JSON.stringify(b),
  );

  vetIcons = vetIcons;

  constructor() {
    effect(() => {
      this.formGroup.patchValue(this.filters());
    });

    effect(() => {
      const filters = withoutEmptyProperties(this.debouncedFormValue());
      this.filtersChangeRealtime.emit(filters);
    });
  }

  createFormGroup() {
    return new FormGroup({
      search: new FormControl(''),
      program_name_or_code: new FormControl(''),
      field: new FormControl<string | null>(null),
      region: new FormControl<string | null>(null),
      district: new FormControl<string | null>(null),
      organisation_name: new FormControl(''),
      program_kind: new FormControl<string | null>(null),
      tuition_start_date: new FormControl<string | null>(null),
      tuition_end_date: new FormControl<string | null>(null),
      financing_type: new FormControl<string | null>(null),
      partner: new FormControl<string | null>(null),
      current: new FormControl(false),
      planned: new FormControl(false),
    });
  }

  onSubmit() {
    if (this.formGroup.valid) {
      this.filtersChange.emit(withoutEmptyProperties(this.formGroup.value) as ShortTermProgramFilters);
      this.onClose();
    }
  }

  onClearClick() {
    this.formGroup.patchValue({
      search: '',
      program_name_or_code: '',
      organisation_name: '',
      field: null,
      region: null,
      district: null,
      program_kind: null,
      tuition_start_date: null,
      tuition_end_date: null,
      financing_type: null,
      partner: null,
      current: null,
      planned: null,
    });
    this.onSubmit();
  }

  onClose() {
    this.dialogClose.emit();
  }
}
