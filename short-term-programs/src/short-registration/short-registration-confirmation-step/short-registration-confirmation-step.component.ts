import { ChangeDetectionStrategy, Component, inject, input, output } from '@angular/core';
import { TranslocoPipe } from '@jsverse/transloco';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { ButtonComponent } from '@progress/kendo-angular-buttons';
import { WA_WINDOW } from '@ng-web-apis/common';
import { vetIcons } from '@vet/shared';

export type ShortRegistrationConfirmationStepFormGroup = FormGroup<{}>;

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

  window = inject(WA_WINDOW);

  onSubmit() {
    this.formGroup().markAllAsTouched();

    if (this.formGroup().valid) {
      this.complete.emit();
    }
  }

  onBack() {
    this.back.emit();
  }

  onPrint() {
    this.window.print();
  }

  protected readonly vetIcons = vetIcons;
}
