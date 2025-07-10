import { ChangeDetectionStrategy, Component, effect, input, output } from '@angular/core';
import { TranslocoPipe } from '@jsverse/transloco';
import { ButtonComponent, FormControls, InfoComponent, SelectorComponent } from '@vet/shared';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { useUserSpecificEducationLevelOptions } from '@vet/shared-resources';

export interface ShortRegistrationGeneralInformationStepFormData {
  education_level: number | null;
}

export type ShortRegistrationGeneralInformationStepFormGroup = FormGroup<
  FormControls<ShortRegistrationGeneralInformationStepFormData>
>;

@Component({
  selector: 'vet-short-registration-general-information-step',
  imports: [TranslocoPipe, InfoComponent, SelectorComponent, ReactiveFormsModule, ButtonComponent, ButtonComponent],
  templateUrl: './short-registration-general-information-step.component.html',
  styleUrl: './short-registration-general-information-step.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
})
export class ShortRegistrationGeneralInformationStepComponent {
  formGroup = input.required<ShortRegistrationGeneralInformationStepFormGroup>();
  next = output();

  educationLevelOptions = useUserSpecificEducationLevelOptions();

  constructor() {
    effect(() => {
      const educationLevelOptions = this.educationLevelOptions();

      if (educationLevelOptions.length === 1) {
        this.formGroup().setValue({
          education_level: educationLevelOptions[0].value,
        });
      }
    });
  }

  onSubmit() {
    this.formGroup().markAllAsTouched();

    if (this.formGroup().valid) {
      this.next.emit();
    }
  }
}
