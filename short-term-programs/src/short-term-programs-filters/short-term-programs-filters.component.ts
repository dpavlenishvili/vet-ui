import { ChangeDetectionStrategy, Component, computed, effect, input, output, signal } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { TextBoxComponent, TextBoxSuffixTemplateDirective } from '@progress/kendo-angular-inputs';
import { SVGIconComponent } from '@progress/kendo-angular-icons';
import { FilterOptionsMap, SelectorComponent, vetIcons, VetSwitchComponent, withoutEmptyProperties } from '@vet/shared';
import { TranslocoPipe } from '@jsverse/transloco';
import { ButtonComponent } from '@progress/kendo-angular-buttons';
import { NgTemplateOutlet } from '@angular/common';

export interface ShortTermProgramFilters {
  search?: string | null;
  program?: string | null;
  field?: string | null;
  region?: string | null;
  district?: string | null;
  organisation?: string | null;
  program_kind?: string | null;
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
  filterOptionsMap = input.required<FilterOptionsMap>();
  filters = input.required<ShortTermProgramFilters>();
  filtersChange = output<ShortTermProgramFilters>();

  hasExtraFilters = computed(() => Object.keys(this.filters()).filter(key => key !== 'search').length > 0);
  formGroup = this.createFormGroup();
  isExpanded = signal(false);
  institutionOptions = computed(() => this.filterOptionsMap().get('organisation'));
  regionOptions = computed(() => this.filterOptionsMap().get('region'));
  districtOptions = computed(() => this.filterOptionsMap().get('district'));
  programKindOptions = computed(() => this.filterOptionsMap().get('program_kind'));

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
      program_name: new FormControl(''),
      field: new FormControl<string | null>(null),
      region: new FormControl<string | null>(null),
      district: new FormControl<string | null>(null),
      organisation: new FormControl<string | null>(null),
      program_kind: new FormControl<string | null>(null),
      current: new FormControl(false),
      planned: new FormControl(false),
    });
  }

  onSubmit() {
    this.filtersChange.emit(
      withoutEmptyProperties(this.formGroup.value) as ShortTermProgramFilters
    )
  }

  onToggleExpansion() {
    this.isExpanded.update((isExpanded) => !isExpanded);
  }

  onClearClick() {
    this.formGroup.reset();
    this.onSubmit();
  }
}
