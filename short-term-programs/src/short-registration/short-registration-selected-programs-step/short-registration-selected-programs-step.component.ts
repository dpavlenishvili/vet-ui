import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { TranslocoPipe } from '@jsverse/transloco';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { ButtonComponent } from '@progress/kendo-angular-buttons';

export type ShortRegistrationSelectedProgramsStepFormGroup = FormGroup<{}>;

@Component({
  selector: 'vet-short-registration-selected-programs-step',
  imports: [TranslocoPipe, ReactiveFormsModule, ButtonComponent],
  templateUrl: './short-registration-selected-programs-step.component.html',
  styleUrl: './short-registration-selected-programs-step.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
})
export class ShortRegistrationSelectedProgramsStepComponent {
  formGroup = input.required<ShortRegistrationSelectedProgramsStepFormGroup>();
  next = output();
  back = output();

  onSubmit() {
    this.formGroup().markAllAsTouched();

    if (this.formGroup().valid) {
      this.next.emit();
    }
  }

  onBack() {
    this.back.emit();
  }
}
