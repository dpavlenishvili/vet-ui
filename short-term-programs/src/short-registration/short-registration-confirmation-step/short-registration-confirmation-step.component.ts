import { ChangeDetectionStrategy, Component, computed, inject, input, output, PLATFORM_ID } from '@angular/core';
import { TranslocoPipe } from '@jsverse/transloco';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { ButtonComponent, FormControls, InfoComponent, useControlValue, vetIcons } from '@vet/shared';
import { AuthenticationService } from '@vet/auth';
import { rxResource } from '@angular/core/rxjs-interop';
import { AdmissionService, ShortProgramAdmission } from '@vet/backend';
import {
  ShortRegistrationSelectedProgramsGridComponent
} from '../short-registration-selected-programs-step/short-registration-selected-programs-grid/short-registration-selected-programs-grid.component';
import { isPlatformBrowser } from '@angular/common';

export interface ShortRegistrationConfirmationStepFormData {
  selected_programs: ShortProgramAdmission[] | null;
}

export type ShortRegistrationConfirmationStepFormGroup = FormGroup<
  FormControls<ShortRegistrationConfirmationStepFormData>
>;

@Component({
  selector: 'vet-short-registration-confirmation-step',
  imports: [
    TranslocoPipe,
    ReactiveFormsModule,
    ButtonComponent,
    ButtonComponent,
    ShortRegistrationSelectedProgramsGridComponent,
    InfoComponent,
  ],
  templateUrl: './short-registration-confirmation-step.component.html',
  styleUrl: './short-registration-confirmation-step.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
})
export class ShortRegistrationConfirmationStepComponent {
  formGroup = input.required<ShortRegistrationConfirmationStepFormGroup>();
  complete = output();
  back = output();

  user = inject(AuthenticationService).user;
  admissionService = inject(AdmissionService);
  platformId = inject(PLATFORM_ID);

  educationStatus = rxResource({
    loader: () => this.admissionService.educationStatus(),
  });
  selectedPrograms = useControlValue(this.formGroup, (form) => form.controls.selected_programs);
  details = computed(() => {
    const user = this.user();
    const educationStatus = this.educationStatus.value();

    if (!user || this.educationStatus.isLoading()) {
      return null;
    }

    return [
      { label: 'shorts.pid', value: user.pid },
      { label: 'shorts.name_surname', value: user.name },
      { label: 'shorts.mobile', value: user.phone },
      { label: 'shorts.education', value: educationStatus?.level },
    ];
  });

  vetIcons = vetIcons;

  get isBrowser() {
    return isPlatformBrowser(this.platformId);
  }

  onSubmit() {
    this.formGroup().markAllAsTouched();

    if (this.formGroup().valid) {
      this.complete.emit();
    }
  }

  onBack() {
    this.back.emit();
  }
}
