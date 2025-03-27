import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  Inject,
  inject,
  input,
  output,
  signal,
} from '@angular/core';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { InputsModule, RadioButtonModule } from '@progress/kendo-angular-inputs';
import { ButtonModule } from '@progress/kendo-angular-buttons';
import { LabelModule } from '@progress/kendo-angular-label';
import { SVGIconModule } from '@progress/kendo-angular-icons';
import * as kendoIcons from '@progress/kendo-svg-icons';
import { TranslocoPipe } from '@jsverse/transloco';
import { AuthenticationService } from '@vet/auth';
import { rxResource } from '@angular/core/rxjs-interop';
import { AdmissionService } from '@vet/backend';
import {
  ProgramSelectedProgramsComponent,
  ProgramSelectedProgramsStepFormGroup,
} from '../program-selected-programs/program-selected-programs.component';
import { ProgramGeneralInformationStepFormGroup } from '../program-general-information-step/program-general-information-step.component';
import { NgClass } from '@angular/common';
import { Citizenship, FileUploadComponent, InfoComponent, vetIcons } from '@vet/shared';
import { ProgramSsmStepFormGroup } from '../program-ssm-step/program-ssm-step.component';
import { WA_WINDOW } from '@ng-web-apis/common';
import { admissionProgramsResource } from '../admission-programs-resource';

export type ProgramSelectionStepFormGroup = FormGroup;

@Component({
  selector: 'vet-program-confirmation-step',
  imports: [
    ReactiveFormsModule,
    InputsModule,
    RadioButtonModule,
    ButtonModule,
    LabelModule,
    SVGIconModule,
    TranslocoPipe,
    ProgramSelectedProgramsComponent,
    InfoComponent,
    NgClass,
    FileUploadComponent,
  ],
  templateUrl: './program-confirmation-step.component.html',
  styleUrl: './program-confirmation-step.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ProgramConfirmationStepComponent implements AfterViewInit {
  form = input<ProgramSelectionStepFormGroup>();
  generalInformationFormGroup = input<ProgramGeneralInformationStepFormGroup>();
  ssmFormGroup = input<ProgramSsmStepFormGroup>();
  selectedProgramsForm = input<ProgramSelectedProgramsStepFormGroup>();
  admissionId = input<string | null>();
  nextClick = output();
  previousClick = output();

  kendoIcons = kendoIcons;
  vetIcons = vetIcons;
  citizenship = Citizenship;
  user = inject(AuthenticationService).user;

  admissionService = inject(AdmissionService);
  educationStatus = rxResource({
    loader: () => this.admissionService.educationStatus(),
  });
  selectedPrograms = admissionProgramsResource(this.admissionId);
  maxLengthOfRequirements = 2000;

  specialRequirements = signal<string[]>([]);
  isAbroadEnabled = signal(false);
  isOcuEnabled = signal(false);

  constructor(@Inject(WA_WINDOW) private window: Window) {}

  onPreviousClick() {
    this.previousClick.emit();
  }

  onNextClick() {
    this.form()?.markAllAsTouched();
    if (this.form()?.valid) {
      this.nextClick.emit();
    }
  }

  onPrintClick() {
    this.window?.print?.();
  }

  ngAfterViewInit() {
    const value = this.generalInformationFormGroup()?.getRawValue();

    this.specialRequirements.set(value.spec_env);
    if (this.user()?.residential !== this.citizenship.Georgian) {
      this.isAbroadEnabled.set(value?.complete_edu_abroad);
      this.isOcuEnabled.set(value?.complete_base_edu_abroad);
    } else {
      this.isAbroadEnabled.set(value?.abroad_doc.length > 0);
      this.isOcuEnabled.set(value?.ocu_doc.length > 0);
    }
  }
}
