import { ChangeDetectionStrategy, Component, effect, input, OnInit, output } from '@angular/core';
import { TranslocoPipe } from '@jsverse/transloco';
import { ButtonComponent, FormControls, InfoComponent, SelectorComponent } from '@vet/shared';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { useUserSpecificEducationLevelOptions } from '@vet/shared-resources';
import { ShortRegistrationProgramSelectionStepFormGroup } from '../short-registration-program-selection-step/short-registration-program-selection-step.component';
import { tap } from 'rxjs';

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
export class ShortRegistrationGeneralInformationStepComponent implements OnInit {
  formGroup = input.required<ShortRegistrationGeneralInformationStepFormGroup>();
  selectedProgramsForm = input.required<ShortRegistrationProgramSelectionStepFormGroup>();
  next = output();

  educationLevelOptions = useUserSpecificEducationLevelOptions();

  constructor() {
    effect(() => {
      const educationLevelOptions = this.educationLevelOptions();

      if (!educationLevelOptions || educationLevelOptions.length === 0) {
        return;
      }

      const currentValue = this.formGroup().value.education_level;

      if (educationLevelOptions.length === 1) {
        const singleOptionValue = educationLevelOptions[0].value;

        if (singleOptionValue != null) {
          const valueToSet = Number(singleOptionValue);

          if (currentValue !== valueToSet) {
            this.formGroup().patchValue({
              education_level: valueToSet,
            });
          }
        }
      } else if (educationLevelOptions.length > 1) {
        if (currentValue != null) {
          const isValidOption = educationLevelOptions.some((option) => Number(option.value) === currentValue);

          if (!isValidOption) {
            this.formGroup().patchValue({
              education_level: null,
            });
          }
        }
      }
    });
  }

  ngOnInit(): void {
    this.onEducationChange();
  }

  onEducationChange() {
    this.formGroup()
      .get('education_level')
      ?.valueChanges.pipe(
        tap(() => {
          this.selectedProgramsForm().patchValue({
            selected_programs: [],
          });
        }),
      )
      .subscribe();
  }

  onSubmit() {
    this.formGroup().markAllAsTouched();

    if (this.formGroup().valid) {
      this.next.emit();
    }
  }
}
