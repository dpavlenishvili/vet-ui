import { ChangeDetectionStrategy, Component, effect, inject, signal, TemplateRef, viewChild } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { ShortRegistrationStepperComponent } from './short-registration-stepper/short-registration-stepper.component';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { toSignal } from '@angular/core/rxjs-interop';
import { of } from 'rxjs';
import { getCurrentStepIndex, WizardStepDefinition } from '@vet/shared';
import { ShortRegistrationGeneralInformationStepComponent } from './short-registration-general-information-step/short-registration-general-information-step.component';
import { ShortRegistrationProgramSelectionStepComponent } from './short-registration-program-selection-step/short-registration-program-selection-step.component';
import { ShortRegistrationSelectedProgramsStepComponent } from './short-registration-selected-programs-step/short-registration-selected-programs-step.component';
import { ShortRegistrationConfirmationStepComponent } from './short-registration-confirmation-step/short-registration-confirmation-step.component';
import { ShortProgramAdmission } from '@vet/backend';

@Component({
  selector: 'vet-short-registration',
  imports: [
    ShortRegistrationStepperComponent,
    ShortRegistrationGeneralInformationStepComponent,
    ShortRegistrationProgramSelectionStepComponent,
    ShortRegistrationSelectedProgramsStepComponent,
    ShortRegistrationConfirmationStepComponent,
  ],
  templateUrl: './short-registration.component.html',
  styleUrl: './short-registration.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
})
export class ShortRegistrationComponent {
  router = inject(Router);
  activatedRoute = inject(ActivatedRoute);
  params = toSignal(this.activatedRoute.firstChild?.params ?? of({} as Params));

  formGroup = this.createFormGroup();
  generalInformationStepTemplate = viewChild.required<TemplateRef<unknown>>('generalInformationStepTemplate');
  programSelectionStepTemplate = viewChild.required<TemplateRef<unknown>>('programSelectionStepTemplate');
  selectedProgramsStepTemplate = viewChild.required<TemplateRef<unknown>>('selectedProgramsStepTemplate');
  confirmationStepTemplate = viewChild.required<TemplateRef<unknown>>('confirmationStepTemplate');
  steps: WizardStepDefinition[] = [
    {
      label: 'shorts.general-information',
      title: 'shorts.general-information',
      form: () => this.formGroup.controls.general_information,
      template: this.generalInformationStepTemplate,
      path: 'general-information',
    },
    {
      label: 'shorts.programs-selection',
      title: 'shorts.programs-selection',
      form: () => this.formGroup.controls.program_selection,
      template: this.programSelectionStepTemplate,
      path: 'programs-selection',
    },
    {
      label: 'shorts.selected-programs',
      title: 'shorts.selected-programs',
      form: () => this.formGroup.controls.program_selection,
      template: this.selectedProgramsStepTemplate,
      path: 'selected-programs',
    },
    {
      label: 'shorts.confirmation',
      title: 'shorts.confirmation',
      form: () => this.formGroup.controls.confirmation,
      template: this.confirmationStepTemplate,
      path: 'confirmation',
    },
  ];
  stepIndex = signal(0);

  constructor() {
    effect(() => {
      const requestedStepPath = this.params()?.['step'];
      const { requestedStepIndex, currentStepIndex } = getCurrentStepIndex(this.steps, requestedStepPath);

      if (currentStepIndex === requestedStepIndex) {
        this.stepIndex.set(requestedStepIndex);
      } else {
        this.navigateUserToStep(currentStepIndex);
      }
    });
  }

  createFormGroup() {
    return new FormGroup({
      general_information: new FormGroup({
        education_level: new FormControl<number | null>(1, Validators.required),
      }),
      program_selection: new FormGroup({
        selected_programs: new FormControl<ShortProgramAdmission[]>([], Validators.required),
      }),
      confirmation: new FormGroup({}),
    });
  }

  onNext() {
    if (this.stepIndex() < this.steps.length - 1) {
      console.log(this.formGroup.value);
      this.onStepIndexChange(this.stepIndex() + 1);
    }
  }

  onBack() {
    if (this.stepIndex() > 0) {
      this.onStepIndexChange(this.stepIndex() - 1);
    }
  }

  onSubmit() {
    alert('Complete!');
  }

  onStepIndexChange(stepIndex: number) {
    this.stepIndex.set(stepIndex);
    this.navigateUserToStep(stepIndex);
  }

  navigateUserToStep(stepIndex: number) {
    const step = this.steps[stepIndex];

    if (step) {
      void this.router.navigate(['programs', 'short', 'registration', step.path]);
    }
  }
}
