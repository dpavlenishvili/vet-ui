import { ChangeDetectionStrategy, Component, computed, signal, TemplateRef, viewChild } from '@angular/core';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { KENDO_LAYOUT } from '@progress/kendo-angular-layout';
import { StepperActivateEvent } from '@progress/kendo-angular-layout/stepper/events/activate-event';
import { ProgramGeneralInformationStepComponent } from './program-general-information-step/program-general-information-step.component';
import { TranslocoPipe } from '@jsverse/transloco';
import { ProgramSelectionStepComponent } from './program-selection-step/program-selection-step.component';
import { ProgramSelectedProgramsStepComponent } from './program-selected-programs-step/program-selected-programs-step.component';
import { ProgramConfirmationStepComponent } from './program-confirmation-step/program-confirmation-step.component';
import { NgTemplateOutlet } from '@angular/common';

interface StepDefinition {
  label: string;
  title: string;
  form: () => FormGroup;
  template: TemplateRef<void>;
}

@Component({
  selector: 'vet-program-registration',
  imports: [
    KENDO_LAYOUT,
    ReactiveFormsModule,
    ProgramGeneralInformationStepComponent,
    TranslocoPipe,
    ProgramSelectionStepComponent,
    ProgramSelectedProgramsStepComponent,
    ProgramConfirmationStepComponent,
    NgTemplateOutlet,
  ],
  templateUrl: './program-registration.component.html',
  styleUrl: './program-registration.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
})
export class ProgramRegistrationComponent {
  protected readonly currentStepIndex = signal(0);
  protected readonly formGroup = this.createFormGroup();
  protected currentStep = computed(() => this.steps()[this.currentStepIndex()]);
  protected steps = computed((): StepDefinition[] => [
    {
      label: 'programs.general_information',
      title: 'programs.general_information',
      form: () => this.formGroup.controls.general_information,
      template: this._programGeneralInformationStepTmpl(),
    },
    {
      label: 'programs.program_selection',
      title: 'programs.program_selection',
      form: () => this.formGroup.controls.program_selection,
      template: this._programSelectionStepTmpl(),
    },
    {
      label: 'programs.selected_programs',
      title: 'programs.selected_programs',
      form: () => this.formGroup.controls.selected_programs,
      template: this._programSelectedProgramsStepTmpl(),
    },
    {
      label: 'programs.confirmation',
      title: 'programs.confirmation',
      form: () => this.formGroup.controls.confirmation,
      template: this._programConfirmationStepTmpl(),
    },
  ]);
  private _programGeneralInformationStepTmpl = viewChild.required('programGeneralInformationStepTmpl', {
    read: TemplateRef,
  });
  private _programSelectionStepTmpl = viewChild.required('programSelectionStepTmpl', { read: TemplateRef });
  private _programSelectedProgramsStepTmpl = viewChild.required('programSelectedProgramsStepTmpl', {
    read: TemplateRef,
  });
  private _programConfirmationStepTmpl = viewChild.required('programConfirmationStepTmpl', { read: TemplateRef });

  protected createFormGroup() {
    return new FormGroup({
      general_information: new FormGroup({}),
      program_selection: new FormGroup({}),
      selected_programs: new FormGroup({}),
      confirmation: new FormGroup({}),
    });
  }

  protected isStepValid(stepIndex: number): boolean {
    const step = this.steps()[stepIndex];

    return step && !!step.form()?.valid;
  }

  protected onStepChange(event: StepperActivateEvent) {
    if (this.isStepValid(this.currentStepIndex()) || event.index < this.currentStepIndex()) {
      this.currentStepIndex.set(event.index);
    } else {
      event.preventDefault();
    }
  }

  protected onPreviousClick() {
    if (this.currentStepIndex() > 0) {
      this.currentStepIndex.set(this.currentStepIndex() - 1);
    }
  }

  protected onNextClick() {
    if (this.isStepValid(this.currentStepIndex())) {
      if (this.currentStepIndex() === this.steps.length - 1) {
        // submit
      } else {
        this.currentStepIndex.set(this.currentStepIndex() + 1);
      }
    }
  }
}
