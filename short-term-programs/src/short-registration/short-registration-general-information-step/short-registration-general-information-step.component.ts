import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { TranslocoPipe } from '@jsverse/transloco';
import { InfoComponent, SelectorComponent } from '@vet/shared';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { ButtonComponent } from '@progress/kendo-angular-buttons';
import { useEducationLevels } from '../../short-term.resources';

export type ShortRegistrationGeneralInformationStepFormGroup = FormGroup<{
  education_level: FormControl<number | null>;
}>;

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
