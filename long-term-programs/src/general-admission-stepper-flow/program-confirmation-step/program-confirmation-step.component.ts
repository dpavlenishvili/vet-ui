import { ChangeDetectionStrategy, Component, computed, Inject, inject, input, output } from '@angular/core';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { InputsModule, RadioButtonModule } from '@progress/kendo-angular-inputs';
import { ButtonModule } from '@progress/kendo-angular-buttons';
import { LabelModule } from '@progress/kendo-angular-label';
import { SVGIconModule } from '@progress/kendo-angular-icons';
import * as kendoIcons from '@progress/kendo-svg-icons';
import { TranslocoPipe } from '@jsverse/transloco';
import { CustomAuthService } from '@vet/auth';
import { rxResource } from '@angular/core/rxjs-interop';
import { AdmissionService } from '@vet/backend';
import {
  ProgramSelectedProgramsComponent,
  ProgramSelectedProgramsStepFormGroup
} from '../program-selected-programs/program-selected-programs.component';
import {
  ProgramGeneralInformationStepFormGroup
} from '../program-general-information-step/program-general-information-step.component';
import { NgClass } from '@angular/common';
import { InfoComponent, UploadedFile, vetIcons } from '@vet/shared';
import { ProgramSsmStepFormGroup } from '../program-ssm-step/program-ssm-step.component';
import { WA_WINDOW } from '@ng-web-apis/common';

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
    NgClass
  ],
  templateUrl: './program-confirmation-step.component.html',
  styleUrl: './program-confirmation-step.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
})
export class ProgramConfirmationStepComponent {
  form = input<ProgramSelectionStepFormGroup>();
  generalInformationFormGroup = input<ProgramGeneralInformationStepFormGroup>();
  ssmFormGroup = input<ProgramSsmStepFormGroup>();
  selectedProgramsForm = input<ProgramSelectedProgramsStepFormGroup>();
  admissionId = input<string | null>();
  nextClick = output();
  previousClick = output();

  kendoIcons = kendoIcons;
  vetIcons = vetIcons;
  user = inject(CustomAuthService).tokenUser$;

  admissionService = inject(AdmissionService);
  educationStatus = rxResource({
    request: () => ({}),
    loader: () => this.admissionService.educationStatus(),
  });
  maxLengthOfRequirements = 2000;

  constructor(@Inject(WA_WINDOW) private window: Window) {
  }

  onPreviousClick() {
    this.previousClick.emit();
  }

  onNextClick() {
    this.form()?.markAllAsTouched();
    if (this.form()?.valid) {
      this.nextClick.emit();
    }
  }

  getSpecialRequirements() {
    return (this.generalInformationFormGroup()?.controls['spec_env']?.value ?? []) as string[];
  }

  getAbroadDocuments() {
    return (this.generalInformationFormGroup()?.controls['abroad_doc']?.value ?? []) as UploadedFile[];
  }

  getOcuDocuments() {
    return (this.generalInformationFormGroup()?.controls['ocu_doc']?.value ?? []) as UploadedFile[];
  }

  onPrintClick() {
    this.window?.print?.();
  }

  onDownloadClick(file: UploadedFile) {
    //downloadFile არის დასამოდიფიცირებელი, ნახეთ file-upload component ის download ი როგორ მუშაობს
    // downloadFile(file.download_url, file.filename);
  }
}
