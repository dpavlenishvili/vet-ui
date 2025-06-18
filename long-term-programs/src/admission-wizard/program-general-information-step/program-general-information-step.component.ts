import { ChangeDetectionStrategy, Component, computed, inject, input, OnInit, output, signal } from '@angular/core';
import { FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { InputsModule, RadioButtonModule } from '@progress/kendo-angular-inputs';
import { ButtonModule } from '@progress/kendo-angular-buttons';
import { LabelModule } from '@progress/kendo-angular-label';
import { SVGIconModule } from '@progress/kendo-angular-icons';
import { TranslocoPipe } from '@jsverse/transloco';
import { KENDO_DROPDOWNLIST } from '@progress/kendo-angular-dropdowns';
import { GeneralsService } from '@vet/backend';
import { Citizenship, FileUploadComponent, InfoComponent, kendoIcons, UploadedFile, useConfirm } from '@vet/shared';
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
  ],
  templateUrl: './program-general-information-step.component.html',
  styleUrl: './program-general-information-step.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProgramGeneralInformationStepComponent implements OnInit {
  nextClick = output();
  clearSelectedPrograms = output();

  form = input<ProgramGeneralInformationStepFormGroup>();
  isSpecEnvEnabled = signal(false);
  isAbroadEnabled = signal(false);
  isOcuEnabled = signal(false);
  invalidStudentStatus = signal(false);
  previousEducationId = signal<null | number>(null);
  abroadDoc = computed(() => this.form()?.get('abroad_doc'));
  ocuDoc = computed(() => this.form()?.get('ocu_doc'));
  protected user = inject(AuthenticationService).user;

  kendoIcons = kendoIcons;
  citizenship = Citizenship;
  specEnvs = signal(['programs.elevatorRamp', 'programs.testTimeExtension', 'programs.testFontSizeIncrease']);
  generalsService = inject(GeneralsService);
  confirm = useConfirm();

  educations$ = rxResource({
    loader: () =>
      this.generalsService.getAllConfigs({ key: 'education_levels' }).pipe(
        delay(200),
        tap(() => {
          const educationLevel = this.form()?.get('education_level')?.getRawValue();
          const educationLevelId = this.form()?.get('education_level_id')?.getRawValue();
          this.invalidStudentStatus.set(!(educationLevel && educationLevelId));
        }),
        map((res) => {
          const educationLevelId = this.form()?.get('education_level_id')?.getRawValue();
          if (res.education_levels && educationLevelId) {
            return res.education_levels.filter((item) => Number(item.id) === Number(educationLevelId));
          }
          return res.education_levels;
        }),
      ),
  });
  cities$ = rxResource({
    loader: () => this.generalsService.getDistrictsList().pipe(map((res) => res.data)),
  });
  languages$ = rxResource({
    loader: () => this.generalsService.getAllConfigs({ key: 'languages' }).pipe(map((res) => res.languages)),
  });

  onNextClick() {
    this.form()?.markAllAsTouched();
    if (this.form()?.valid) {
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

  handleRemoveFile(files: UploadedFile[], field: string) {
    this.form()?.get(field)?.patchValue(files);
  }

  toggleSwitcher(event: boolean, key: string) {
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
    // this.confirm.show({
    //   content: 'programs.educationChangeNote',
    //   onConfirm: () => {
    //     control?.setValue(educationId);
    //     this.clearSelectedPrograms.emit();
    //     this.previousEducationId.set(educationId);
    //   },
    //   onDismiss: () => {
    //     control?.setValue(this.previousEducationId()?.toString(), { emitEvent: false });
    //   },
    // });

    this.confirm.warning({
      title: 'programs.changeEducationLevel',
      content: 'programs.educationChangeNote',
      confirmButtonText: 'programs.continue',
      dismissButtonText: 'shared.cancel',
      onConfirm: () => {
        control?.setValue(educationId);
        this.clearSelectedPrograms.emit();
        this.previousEducationId.set(educationId);
      },
      onDismiss: () => {
        control?.setValue(this.previousEducationId()?.toString(), { emitEvent: false });
      },
    });
  }

  districtChange() {
    this.confirm.info({
      title: 'programs.testLocationChange',
      content: 'programs.testReallocationNote',
      showYesNoButtons: false,
      singleTypeDialogActionText: 'shared.understood',
      onConfirm: () => {}
    });
  }

  languageChange() {
    this.confirm.info({
      title: 'programs.testLanguageChange',
      content: 'programs.georgianModuleNote',
      showYesNoButtons: false,
      singleTypeDialogActionText: 'shared.understood',
      onConfirm: () => {}
    });
  }

  onSpecEnvSwitchChange(checked: boolean) {
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
    this.previousEducationId.set(this.form()?.get('education')?.getRawValue());
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
