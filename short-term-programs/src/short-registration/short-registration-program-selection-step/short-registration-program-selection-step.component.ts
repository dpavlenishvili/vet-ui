import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  input,
  output,
  PLATFORM_ID,
  signal,
} from '@angular/core';
import { TranslocoPipe } from '@jsverse/transloco';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { ShortRegistrationProgramSelectionGridComponent } from './short-registration-program-selection-grid/short-registration-program-selection-grid.component';
import { ShortProgramAdmission } from '@vet/backend';
import { ActivatedRoute, Router } from '@angular/router';
import {
  ButtonComponent,
  FormControls,
  getUniqueItems,
  useAlert,
  useControlValue,
  useFilters,
  useFiltersUpdater,
  usePage,
  usePageUpdater,
} from '@vet/shared';
import { isPlatformBrowser } from '@angular/common';
import { ShortTermProgramFilters } from '../../short-term-programs.types';
import { ShortTermProgramsFiltersComponent } from 'short-term-programs/src/short-term-programs-filters/short-term-programs-filters.component';
import { useShortTermProgramAdmissions } from '../../short-term.resources';

export interface ShortRegistrationProgramSelectionStepFormData {
  selected_programs: ShortProgramAdmission[] | null;
}

export type ShortRegistrationProgramSelectionStepFormGroup = FormGroup<
  FormControls<ShortRegistrationProgramSelectionStepFormData>
>;

@Component({
  selector: 'vet-short-registration-program-selection-step',
  imports: [
    TranslocoPipe,
    ReactiveFormsModule,
    ButtonComponent,
    ShortRegistrationProgramSelectionGridComponent,
    ShortTermProgramsFiltersComponent,
    ButtonComponent,
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

  platformId = inject(PLATFORM_ID);
  router = inject(Router);
  activatedRoute = inject(ActivatedRoute);

  filters = useFilters<ShortTermProgramFilters>();
  page = usePage();
  updateFilters = useFiltersUpdater<ShortTermProgramFilters>();
  updatePage = usePageUpdater();
  alert = useAlert();
  data = useShortTermProgramAdmissions();
  selectedPrograms = useControlValue(this.formGroup, (form) => form.controls.selected_programs);
  selectedProgramIds = computed(() => {
    const selectedPrograms: ShortProgramAdmission[] = this.selectedPrograms() ?? [];

    return selectedPrograms.map((item) => item.id).filter(Boolean) as number[];
  });
  isProgramSelectionDisabled = signal(false);

  get isBrowser() {
    return isPlatformBrowser(this.platformId);
  }

  onFiltersChange(filters: ShortTermProgramFilters) {
    this.updateFilters(filters);
  }

  onPageChange(page: number) {
    this.updatePage(page);
  }

  onSubmit() {
    this.formGroup().markAllAsTouched();

    if (this.formGroup().valid) {
      this.next.emit();
    } else {
      this.alert.show({
        text: 'shorts.must_choose_min_one',
        variant: 'warning',
      });
    }
  }

  onBack() {
    this.back.emit();
  }

  onSelectProgram(item: ShortProgramAdmission) {
    const control = this.formGroup().controls.selected_programs;

    if (item.id) {
      const newItems = [...(control.value ?? []), item];
      control.setValue(getUniqueItems(newItems, (item) => item.id as number));

      if ((control.value ?? []).length === 3) {
        this.isProgramSelectionDisabled.set(true);
      }
    }
  }

  onUnselectProgram(item: ShortProgramAdmission) {
    const control = this.formGroup().controls.selected_programs;

    if (item.id) {
      const items = control.value ?? [];
      control.setValue(items.filter((i) => i.id !== item.id));

      if((control.value ?? []).length < 3) {
        this.isProgramSelectionDisabled.set(false);
      }
    }
  }
}
