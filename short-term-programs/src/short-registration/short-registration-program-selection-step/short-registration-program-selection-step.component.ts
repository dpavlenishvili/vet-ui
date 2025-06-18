import { ChangeDetectionStrategy, Component, computed, inject, input, output, PLATFORM_ID } from '@angular/core';
import { TranslocoPipe } from '@jsverse/transloco';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { ButtonComponent } from '@progress/kendo-angular-buttons';
import { ShortRegistrationProgramSelectionGridComponent } from './short-registration-program-selection-grid/short-registration-program-selection-grid.component';
import { rxResource } from '@angular/core/rxjs-interop';
import { ProgramsService, ShortProgramAdmission } from '@vet/backend';
import { ActivatedRoute, Router } from '@angular/router';
import { flattenQueryParams, getUniqueItems, useControlValue, useFilters, useFiltersUpdater } from '@vet/shared';
import {
  ShortTermProgramFilters,
  ShortTermProgramsFiltersComponent,
} from '../../short-term-programs-filters/short-term-programs-filters.component';
import { isPlatformBrowser } from '@angular/common';

export type ShortRegistrationProgramSelectionStepFormGroup = FormGroup<{
  selected_programs: FormControl<ShortProgramAdmission[] | null>;
}>;

@Component({
  selector: 'vet-short-registration-program-selection-step',
  imports: [
    TranslocoPipe,
    ReactiveFormsModule,
    ButtonComponent,
    ShortRegistrationProgramSelectionGridComponent,
    ShortTermProgramsFiltersComponent,
  ],
  templateUrl: './short-registration-program-selection-step.component.html',
  styleUrl: './short-registration-program-selection-step.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
})
export class ShortRegistrationProgramSelectionStepComponent {
  formGroup = input.required<ShortRegistrationProgramSelectionStepFormGroup>();
  next = output();
  back = output();
  itemSelect = output<ShortProgramAdmission>();
  itemUnselect = output<ShortProgramAdmission>();

  shortProgramsService = inject(ProgramsService);
  platformId = inject(PLATFORM_ID);
  router = inject(Router);
  activatedRoute = inject(ActivatedRoute);

  filters = useFilters<ShortTermProgramFilters>();
  updateFilters = useFiltersUpdater<ShortTermProgramFilters>();
  data = rxResource({
    request: () => this.filters(),
    loader: ({ request }) => this.shortProgramsService.programsShortAdmissions(flattenQueryParams(request, 'filters')),
  });
  programs = computed(() => this.data.value()?.data ?? []);
  selectedPrograms = useControlValue(this.formGroup, (form) => form.controls.selected_programs);
  selectedProgramIds = computed(() => {
    const selectedPrograms: ShortProgramAdmission[] = this.selectedPrograms() ?? [];

    return selectedPrograms.map(item => item.id).filter(Boolean) as number[];
  });

  get isBrowser() {
    return isPlatformBrowser(this.platformId);
  }

  onFiltersChange(filters: ShortTermProgramFilters) {
    this.updateFilters(filters);
  }

  onSubmit() {
    this.formGroup().markAllAsTouched();

    if (this.formGroup().valid) {
      this.next.emit();
    }
  }

  onBack() {
    this.back.emit();
  }

  onSelectProgram(item: ShortProgramAdmission) {
    if (item.id) {
      const control = this.formGroup().controls.selected_programs;
      const newItems = [...(control.value ?? []), item];
      control.setValue(getUniqueItems(newItems, (item) => item.id as number));
    }
  }

  onUnselectProgram(item: ShortProgramAdmission) {
    if (item.id) {
      const control = this.formGroup().controls.selected_programs;
      const items = control.value ?? [];
      control.setValue(items.filter((i) => i.id !== item.id));
    }
  }
}
