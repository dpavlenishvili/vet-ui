import { ChangeDetectionStrategy, Component, computed, inject, input, OnInit, output, signal } from '@angular/core';
import { FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { InputsModule, RadioButtonModule } from '@progress/kendo-angular-inputs';
import { ButtonModule } from '@progress/kendo-angular-buttons';
import { LabelModule } from '@progress/kendo-angular-label';
import { SVGIconModule } from '@progress/kendo-angular-icons';
import { TranslocoPipe } from '@jsverse/transloco';
import { KENDO_DROPDOWNLIST } from '@progress/kendo-angular-dropdowns';
import { AdmissionService, GeneralsService } from '@vet/backend';
import {
  Citizenship,
  UploadedFile,
} from '@vet/shared/utils';
import { useConfirm } from '@vet/shared/dialogs';
import { kendoIcons } from '@vet/shared/icons';
import {
  ButtonComponent,
  FileUploadComponent,
  InfoComponent,
  VetSwitchComponent,
} from '@vet/shared';
import { delay, map, tap } from 'rxjs';
import { AuthenticationService } from '@vet/auth';
import { rxResource } from '@angular/core/rxjs-interop';

export type ProgramGeneralInformationStepFormGroup = FormGroup;

@Component({
  selector: 'vet-program-general-information-step',
  imports: [
    ReactiveFormsModule,
    InputsModule,
    RadioButtonModule,
    ButtonModule,
    LabelModule,
    SVGIconModule,
    TranslocoPipe,
    KENDO_DROPDOWNLIST,
    FileUploadComponent,
    FormsModule,
    InfoComponent,
    VetSwitchComponent,
    ButtonComponent,
  ],
  templateUrl: './program-general-information-step.component.html',
  styleUrl: './program-general-information-step.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProgramGeneralInformationStepComponent implements OnInit {
  nextClick = output();
  clearSelectedPrograms = output();

  form = input<ProgramGeneralInformationStepFormGroup>();
  isViewMode = input<boolean>(false);
  isSpecEnvEnabled = signal(false);
  isAbroadEnabled = signal(false);
  isOcuEnabled = signal(false);
  invalidStudentStatus = signal(false);
  previousEducationId = signal<null | undefined | number>(null);
  abroadDoc = computed(() => this.form()?.get('abroad_doc'));
  ocuDoc = computed(() => this.form()?.get('ocu_doc'));
  kendoIcons = kendoIcons;
  citizenship = Citizenship;
  specEnvs = signal(['programs.elevatorRamp', 'programs.testTimeExtension', 'programs.testFontSizeIncrease']);
  generalsService = inject(GeneralsService);
  admissionService = inject(AdmissionService);
  confirm = useConfirm();
  educations$ = rxResource({
    loader: () =>
      this.admissionService.educationStatus().pipe(
        delay(200),
        tap(() => {
          const educationLevel = this.form()?.get('education_level')?.getRawValue();
          const educationLevelId = this.form()?.get('education_level_id')?.getRawValue();
          this.invalidStudentStatus.set(!(educationLevel && educationLevelId));
          if (this.invalidStudentStatus()) {
            this.form()?.get('doc')?.setValidators(Validators.required);
            this.form()?.get('doc')?.updateValueAndValidity();
          }
        }),
        map((educationStatuses) => {
          // Use API response directly - it already has the correct format {level, levelId}
          const educations = educationStatuses ?? [];

          // Filter by education_level_id if it exists (for student status filtering)
          const educationLevelId = this.form()?.get('education_level_id')?.getRawValue();
          if (educationLevelId && educations.length > 0) {
            return educations.filter((item) => Number(item.levelId) === Number(educationLevelId));
          }

          return educations;
        }),
        tap((educations) => {
          // Auto-select if there's only one education option
          if (educations.length === 1) {
            const educationControl = this.form()?.get('education');
            const currentValue = educationControl?.getRawValue();

            // Only set if there's no existing value
            if (!currentValue && educations[0].levelId) {
              educationControl?.patchValue(educations[0].levelId);
              this.previousEducationId.set(educations[0].levelId);
            }
          }
        }),
      ),
  });
  cities$ = rxResource({
    loader: () => this.generalsService.getDistrictsList().pipe(map((res) => res.data)),
  });
  languages$ = rxResource({
    loader: () => this.generalsService.getAllConfigs({ key: 'languages' }).pipe(map((res) => res.languages)),
  });
  protected user = inject(AuthenticationService).user;

  protected onNextClick(): void {
    if (this.isViewMode()) {
      this.nextClick.emit();
      return;
    }

    const form = this.form();
    if (!form) return;

    form.markAllAsTouched();
    if (form.valid) {
      this.nextClick.emit();
    }
  }

  handleFileUpload(file: UploadedFile, field: string) {
    const payload = { filename: file.filename, base64: file.base64 };
    const currentValue = this.form()?.get(field)?.getRawValue();
    this.form()
      ?.get(field)
      ?.patchValue([...currentValue, payload]);
  }

  handleRemoveFile(event: { removedFile: UploadedFile; remainingFiles: UploadedFile[] }, field: string) {
    const { remainingFiles } = event;
    this.form()?.get(field)?.patchValue(remainingFiles);
  }

  toggleSwitcher(event: boolean, key: string) {
    // Update the appropriate signal based on the key
    if (key === 'abroad_doc' || key === 'complete_edu_abroad') {
      this.isAbroadEnabled.set(event);
    } else if (key === 'ocu_doc' || key === 'complete_base_edu_abroad') {
      this.isOcuEnabled.set(event);
    }

    if (this.user()?.residential !== this.citizenship.Georgian) {
      this.form()?.get(key)?.patchValue(event);
    } else {
      if (event) {
        this.form()?.get(key)?.markAsUntouched();
        this.form()?.get(key)?.setValidators(Validators.required);
      } else {
        this.form()?.get(key)?.reset([]);
        this.form()?.get(key)?.removeValidators(Validators.required);
      }
      this.form()?.get(key)?.updateValueAndValidity();
    }
  }

  onSpecEnvChange(checked: boolean, specEnv: string) {
    const specEnvControl = this.form()?.get('spec_env');

    if (!specEnvControl) return;

    const currentValue = specEnvControl.value || [];

    if (checked) {
      specEnvControl.setValue([...currentValue, specEnv]);
    } else {
      specEnvControl.setValue(currentValue.filter((item: string) => item !== specEnv));
    }
  }

  educationChange(educationId: number) {
    const control = this.form()?.get('education');
    if (!control || !this.previousEducationId()) {
      return;
    }

    this.confirm.warning({
      content: 'programs.educationChangeNote',
      confirmButtonText: 'shared.agree',
      dismissButtonText: 'shared.cancel',
      onConfirm: () => {
        control?.setValue(educationId);
        this.clearSelectedPrograms.emit();
        this.previousEducationId.set(educationId);
      },
      onDismiss: () => {
        control?.setValue(this.previousEducationId(), { emitEvent: false });
      },
    });
  }

  districtChange() {
    this.confirm.warning({
      content: 'programs.testReallocationNote',
      showYesNoButtons: false,
      hideCloseButton: true,
      singleTypeDialogActionText: 'shared.understood',
      onConfirm: () => {},
    });
  }

  languageChange() {
    this.confirm.warning({
      content: 'programs.georgianModuleNote',
      showYesNoButtons: false,
      hideCloseButton: true,
      singleTypeDialogActionText: 'shared.understood',
      onConfirm: () => {},
    });
  }

  onSpecEnvSwitchChange(checked: boolean) {
    this.isSpecEnvEnabled.set(checked);
    const specEnvControl = this.form()?.get('spec_env');

    if (!specEnvControl) return;

    if (checked) {
      specEnvControl?.markAsUntouched();
      specEnvControl?.setValidators(Validators.required);
    } else {
      specEnvControl.reset([]);
      specEnvControl?.removeValidators(Validators.required);
    }
    specEnvControl.updateValueAndValidity();
  }

  ngOnInit(): void {
    const value = this.form()?.getRawValue();
    const educationValue = this.form()?.get('education')?.getRawValue();
    this.previousEducationId.set(educationValue ? Number(educationValue) : null);
    this.isSpecEnvEnabled.set(value.spec_env.length > 0);
    if (this.user()?.residential !== this.citizenship.Georgian) {
      this.isAbroadEnabled.set(value?.complete_edu_abroad);
      this.isOcuEnabled.set(value?.complete_base_edu_abroad);
    } else {
      this.isAbroadEnabled.set(value?.abroad_doc.length > 0);
      this.isOcuEnabled.set(value?.ocu_doc.length > 0);
    }
  }
}
