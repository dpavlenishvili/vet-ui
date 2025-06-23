import { ChangeDetectionStrategy, Component, inject, input, output, PLATFORM_ID } from '@angular/core';
import { TranslocoPipe } from '@jsverse/transloco';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { ButtonComponent } from '@progress/kendo-angular-buttons';
import { ShortProgramAdmission } from '@vet/backend';
import { FormControls, useControlValue } from '@vet/shared';
import { isPlatformBrowser } from '@angular/common';
import { ShortRegistrationSelectedProgramsGridComponent } from './short-registration-selected-programs-grid/short-registration-selected-programs-grid.component';

export interface ShortRegistrationSelectedProgramsStepFormData {
  selected_programs: ShortProgramAdmission[] | null;
}

export type ShortRegistrationSelectedProgramsStepFormGroup = FormGroup<
  FormControls<ShortRegistrationSelectedProgramsStepFormData>
>;

@Component({
  selector: 'vet-short-registration-selected-programs-step',
  imports: [TranslocoPipe, ReactiveFormsModule, ButtonComponent, ShortRegistrationSelectedProgramsGridComponent],
  templateUrl: './short-registration-selected-programs-step.component.html',
  styleUrl: './short-registration-selected-programs-step.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
})
export class ShortRegistrationSelectedProgramsStepComponent {
  formGroup = input.required<ShortRegistrationSelectedProgramsStepFormGroup>();
  next = output();
  back = output();
  itemUnselect = output<ShortProgramAdmission>();

  platformId = inject(PLATFORM_ID);

  selectedPrograms = useControlValue(this.formGroup, (form) => form.controls.selected_programs);

  get isBrowser() {
    return isPlatformBrowser(this.platformId);
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

  onUnselectProgram(item: ShortProgramAdmission) {
    if (item.id) {
      const control = this.formGroup().controls.selected_programs;
      const items = control.value ?? [];
      control.setValue(items.filter((i) => i.id !== item.id));
    }
  }
}
