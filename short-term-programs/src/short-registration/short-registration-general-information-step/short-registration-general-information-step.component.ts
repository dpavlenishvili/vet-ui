import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { TranslocoPipe } from '@jsverse/transloco';
import { FormControls, InfoComponent, SelectorComponent } from '@vet/shared';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { ButtonComponent } from '@progress/kendo-angular-buttons';
import { useEducationLevels } from '../../short-term.resources';

export interface ShortRegistrationGeneralInformationStepFormData {
  education_level: number | null;
}

export type ShortRegistrationGeneralInformationStepFormGroup = FormGroup<
  FormControls<ShortRegistrationGeneralInformationStepFormData>
>;

@Component({
  selector: 'vet-short-registration-general-information-step',
  imports: [TranslocoPipe, InfoComponent, SelectorComponent, ReactiveFormsModule, ButtonComponent],
  templateUrl: './short-registration-general-information-step.component.html',
  styleUrl: './short-registration-general-information-step.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
})
export class ShortRegistrationGeneralInformationStepComponent {
  formGroup = input.required<ShortRegistrationGeneralInformationStepFormGroup>();
  next = output();

  educationLevels = useEducationLevels();

  onSubmit() {
    this.formGroup().markAllAsTouched();

    if (this.formGroup().valid) {
      this.next.emit();
    }
  }
}
