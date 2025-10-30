import { ChangeDetectionStrategy, Component, computed, effect, input, output } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import {
  ButtonComponent,
  DatePickerComponent,
  DialogComponent,
  InputComponent,
  isDate,
  SelectorComponent,
  useControlValue,
  vetIcons,
  VetSwitchComponent,
} from '@vet/shared';
import { TranslocoPipe } from '@jsverse/transloco';
import {
  useDistricts,
  useFilteredDistricts,
  useFinancingTypes,
  useFunding,
  useInstitutionsDictionary,
  usePartners,
  useProgramKinds,
  useRegions,
} from '@vet/shared-resources';
import { ShortTermProgramFilters } from '../short-term-programs.types';
import { useFoundProgramsCount } from '../short-term.resources';

@Component({
  selector: 'vet-short-term-programs-filters-dialog',
  imports: [
    ReactiveFormsModule,
    TranslocoPipe,
    FormsModule,
    DialogComponent,
    SelectorComponent,
    VetSwitchComponent,
    DatePickerComponent,
    InputComponent,
    ButtonComponent,
  ],
  templateUrl: './short-term-programs-filters-dialog.component.html',
  styleUrl: './short-term-programs-filters-dialog.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
})
export class ShortTermProgramsFiltersDialogComponent {
  filters = input.required<ShortTermProgramFilters>();
  filtersChange = output<ShortTermProgramFilters>();
  dialogClose = output();

  readonly normalizedFilters = computed(() =>
    this.normalizeFilters(this.formValue())
  );

  formGroup = this.createFormGroup();
  institutionOptions = useInstitutionsDictionary();
  regionOptions = useRegions();
  districtOptions = useDistricts();
  programKindOptions = useProgramKinds('short-term');
  financingTypeOptions = useFunding();
  partnerOptions = usePartners('short-term');
  formValue = useControlValue(this.formGroup);
  selectedRegion = useControlValue(this.formGroup, (form) => form.controls.region);
  filteredDistricts = useFilteredDistricts(this.selectedRegion, this.districtOptions.value);
  foundResultsCount = useFoundProgramsCount(this.normalizedFilters);

  vetIcons = vetIcons;

  constructor() {
    effect(() => {
      this.formGroup.patchValue(this.filters());
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
      start_study: new FormControl<string | null>(null),
      end_study: new FormControl<string | null>(null),
      funding: new FormControl<string | null>(null),
      partner: new FormControl<string | null>(null),
      current: new FormControl(false),
      planned: new FormControl(false),
    });
  }

  normalizeFilters(filterValue: ShortTermProgramFilters) {
    return {
      ...filterValue,
      start_study: isDate(filterValue.start_study)
        ? this.formatDateForBackend(filterValue.start_study)
        : filterValue.start_study,

      end_study: isDate(filterValue.end_study)
        ? this.formatDateForBackend(filterValue.end_study)
        : filterValue.end_study,
    } as ShortTermProgramFilters;
  }

  formatDateForBackend(date: Date): string {
    return `${date.getFullYear()}-${(date.getMonth() + 1)
      .toString()
      .padStart(2, '0')}-${date.getDate().toString().padStart(2, '0')}`;
  }

  onSubmit() {
    if (this.formGroup.valid) {
      this.filtersChange.emit(this.normalizedFilters());
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
      start_study: null,
      end_study: null,
      funding: null,
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
