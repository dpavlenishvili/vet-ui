import { ChangeDetectionStrategy, Component, inject, input, OnInit, output, signal } from '@angular/core';
import { FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { InputsModule, RadioButtonModule } from '@progress/kendo-angular-inputs';
import { ButtonModule } from '@progress/kendo-angular-buttons';
import { LabelModule } from '@progress/kendo-angular-label';
import { SVGIconModule } from '@progress/kendo-angular-icons';
import { TranslocoPipe, TranslocoService } from '@jsverse/transloco';
import { KENDO_DROPDOWNLIST } from '@progress/kendo-angular-dropdowns';
import { GeneralsService } from '@vet/backend';
import { Citizenship, FileUploadComponent, InfoComponent, kendoIcons, UploadedFile } from '@vet/shared';
import { delay, map, take, tap } from 'rxjs';
import { AuthenticationService } from '@vet/auth';
import { DialogRef, DialogService } from '@progress/kendo-angular-dialog';
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
  standalone: true,
})
export class ProgramGeneralInformationStepComponent implements OnInit {
  nextClick = output();

  form = input<ProgramGeneralInformationStepFormGroup>();
  isSpecEnvEnabled = signal(false);
  isAbroadEnabled = signal(false);
  isOcuEnabled = signal(false);
  invalidStudentStatus = signal(false);
  protected user = inject(AuthenticationService).user;

  kendoIcons = kendoIcons;
  citizenship = Citizenship;
  specEnvs = signal(['programs.elevatorRamp', 'programs.testTimeExtension', 'programs.testFontSizeIncrease']);
  generalsService = inject(GeneralsService);
  dialogService = inject(DialogService);
  translocoService = inject(TranslocoService);

  educations$ = rxResource({
    request: () => ({ key: 'education_levels' }),
    loader: ({ request: { key } }) =>
      this.generalsService.getAllConfigs({ key: key }).pipe(
        delay(100),
        tap(() => {
          const educationLevel = this.form()?.get('education_level')?.getRawValue();
          const educationLevelId = this.form()?.get('education_level_id')?.getRawValue();
          this.invalidStudentStatus.set(!(educationLevel && educationLevelId));
          console.log(this.invalidStudentStatus());
        }),
        map((res) => {
          const educationLevelId = this.form()?.get('education_level_id')?.getRawValue();
          if (res.education_levels && educationLevelId) {
            return res.education_levels.filter((item) => Number(item.id) >= Number(educationLevelId));
          }
          return res.education_levels;
        }),
      ),
  });
  cities$ = rxResource({
    request: () => ({}),
    loader: () => this.generalsService.getDistrictsList().pipe(map((res) => res.data)),
  });
  languages$ = rxResource({
    request: () => ({ key: 'languages' }),
    loader: ({ request: { key } }) =>
      this.generalsService.getAllConfigs({ key: key }).pipe(map((res) => res.languages)),
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
      if (!event) {
        this.form()?.get(key)?.reset([]);
      }
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

  districtChange() {
    const dialog: DialogRef = this.dialogService.open({
      title: this.translocoService.translate('shared.testCity'),
      content: this.translocoService.translate('programs.testReallocationNote'),
      actions: [{ text: this.translocoService.translate('shared.met'), themeColor: 'primary' }],
      width: 400,
    });

    dialog.result.subscribe();
  }

  languageChange() {
    const dialog: DialogRef = this.dialogService.open({
      title: this.translocoService.translate('shared.testLanguage'),
      content: this.translocoService.translate('programs.georgianModuleNote'),
      actions: [{ text: this.translocoService.translate('shared.met'), themeColor: 'primary' }],
      width: 400,
    });

    dialog.result.subscribe();
  }

  onSpecEnvSwitchChange(checked: boolean) {
    const specEnvControl = this.form()?.get('spec_env');

    if (!specEnvControl) return;

    if (checked) {
      specEnvControl?.setValidators(Validators.required);
    } else {
      specEnvControl.reset([]);
      specEnvControl?.removeValidators(Validators.required);
    }
    specEnvControl.updateValueAndValidity();
  }

  ngOnInit(): void {
    this.form()
      ?.valueChanges.pipe(
        tap((value) => {
          this.isSpecEnvEnabled.set(value.spec_env.length > 0);
          if (this.user()?.residential !== this.citizenship.Georgian) {
            this.isAbroadEnabled.set(value?.complete_edu_abroad);
            this.isOcuEnabled.set(value?.complete_base_edu_abroad);
          } else {
            this.isAbroadEnabled.set(value?.abroad_doc.length > 0);
            this.isOcuEnabled.set(value?.ocu_doc.length > 0);
          }
        }),
        take(1),
      )
      .subscribe();
  }
}
