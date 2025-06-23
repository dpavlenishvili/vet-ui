import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { TranslocoPipe } from '@jsverse/transloco';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { ButtonComponent } from '@progress/kendo-angular-buttons';
import { FormControls, vetIcons } from '@vet/shared';

export interface ShortRegistrationConfirmationStepFormData {}

export type ShortRegistrationConfirmationStepFormGroup = FormGroup<
  FormControls<ShortRegistrationConfirmationStepFormData>
>;

@Component({
  selector: 'vet-short-registration-confirmation-step',
  imports: [TranslocoPipe, ReactiveFormsModule, ButtonComponent],
  templateUrl: './short-registration-confirmation-step.component.html',
  styleUrl: './short-registration-confirmation-step.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
})
export class ShortRegistrationConfirmationStepComponent {
  formGroup = input.required<ShortRegistrationConfirmationStepFormGroup>();
  complete = output();
  back = output();

  onSubmit() {
    this.formGroup().markAllAsTouched();

    if (this.formGroup().valid) {
      this.complete.emit();
    }
  }

  onBack() {
    this.back.emit();
  }

  protected readonly vetIcons = vetIcons;
}
