import { ChangeDetectionStrategy, Component, computed, effect, input, output, signal } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { TextBoxComponent, TextBoxSuffixTemplateDirective } from '@progress/kendo-angular-inputs';
import { SVGIconComponent } from '@progress/kendo-angular-icons';
import { SelectorComponent, vetIcons, VetSwitchComponent, withoutEmptyProperties } from '@vet/shared';
import { TranslocoPipe } from '@jsverse/transloco';
import { ButtonComponent } from '@progress/kendo-angular-buttons';
import { NgTemplateOutlet } from '@angular/common';
import { useDistricts, useInstitutionsDictionary, useProgramKinds, useRegions } from '../short-term.resources';

export interface ShortTermProgramFilters {
  search?: string | null;
  program_name_or_code?: string | null;
  field?: string | null;
  region?: string | null;
  district?: string | null;
  organisation_name?: string | null;
  program_kind?: string | null;
  current?: boolean | null;
  planned?: boolean | null;
}

@Component({
  selector: 'vet-short-term-programs-filters',
  imports: [
    ReactiveFormsModule,
    TextBoxComponent,
    TextBoxSuffixTemplateDirective,
    SVGIconComponent,
    TranslocoPipe,
    SelectorComponent,
    VetSwitchComponent,
    ButtonComponent,
    NgTemplateOutlet,
  ],
  templateUrl: './short-term-programs-filters.component.html',
  styleUrl: './short-term-programs-filters.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
})
export class ShortTermProgramsFiltersComponent {
  filters = input.required<ShortTermProgramFilters>();
  filtersChange = output<ShortTermProgramFilters>();

  hasExtraFilters = computed(() => Object.keys(this.filters()).filter((key) => key !== 'search').length > 0);
  formGroup = this.createFormGroup();
  isExpanded = signal(false);
  institutionOptions = useInstitutionsDictionary();
  regionOptions = useRegions();
  districtOptions = useDistricts();
  programKindOptions = useProgramKinds();

  protected readonly vetIcons = vetIcons;

  constructor() {
    effect(() => {
      this.formGroup.patchValue(this.filters());

      if (this.hasExtraFilters()) {
        this.isExpanded.set(true);
      }
    });
  }

  createFormGroup() {
    return new FormGroup({
      search: new FormControl(''),
      program_name_or_code: new FormControl(''),
      field: new FormControl<string | null>(null),
      region: new FormControl<string | null>(null),
      district: new FormControl<string | null>(null),
      organisation_name: new FormControl<string | null>(null),
      program_kind: new FormControl<string | null>(null),
      current: new FormControl(false),
      planned: new FormControl(false),
    });
  }

  onSubmit() {
    this.filtersChange.emit(withoutEmptyProperties(this.formGroup.value) as ShortTermProgramFilters);
  }

  onToggleExpansion() {
    this.isExpanded.update((isExpanded) => !isExpanded);
  }

  onClearClick() {
    this.formGroup.reset();
    this.onSubmit();
  }
}
