import { ChangeDetectionStrategy, Component, computed, inject, input, output } from '@angular/core';
import { FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { InputsModule, RadioButtonModule } from '@progress/kendo-angular-inputs';
import { ButtonModule } from '@progress/kendo-angular-buttons';
import { LabelModule } from '@progress/kendo-angular-label';
import { SVGIconModule } from '@progress/kendo-angular-icons';
import { TranslocoPipe } from '@jsverse/transloco';
import { KENDO_DROPDOWNLIST } from '@progress/kendo-angular-dropdowns';
import { AsyncPipe } from '@angular/common';
import { GeneralsService } from '@vet/backend';
import { FileUploadComponent, kendoIcons, UploadedFile } from '@vet/shared';
import { map, Observable } from 'rxjs';
import { CustomAuthService } from '@vet/auth';
import { DialogRef, DialogService } from '@progress/kendo-angular-dialog';

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
    AsyncPipe,
    FileUploadComponent,
    FormsModule,
  ],
  templateUrl: './program-general-information-step.component.html',
  styleUrl: './program-general-information-step.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
})
export class ProgramGeneralInformationStepComponent {
  nextClick = output();

  form = input<ProgramGeneralInformationStepFormGroup>();
  kendoIcons = kendoIcons;

  tokenUser$ = inject(CustomAuthService).tokenUser$;

  isSpecEnvEnabled = computed(() => {
    console.log(this.form()?.get('spec_env')?.getRawValue())
    return this.form()?.get('spec_env')?.getRawValue().length > 0;
  });
  isAbroadEnabled = computed(() => {
    if (this.tokenUser$()?.residential !== 'GEO') {
      return this.form()?.get('complete_edu_abroad')?.getRawValue();
    } else {
      return this.form()?.get('ocu_doc')?.getRawValue().length > 0;
    }
  });
  isOcuEnabled = computed(() => {
    if (this.tokenUser$()?.residential !== 'GEO') {
      return this.form()?.get('complete_base_edu_abroad')?.getRawValue();
    } else {
      return this.form()?.get('abroad_doc')?.getRawValue().length > 0;
    }
  });

  specEnvs = ['ლიფტი, პანდუსი', 'საგამოცდო დროის გაზრდა', 'ტესტის შრიფტის გაზრდა'];

  generalsService = inject(GeneralsService);
  dialogService = inject(DialogService);

  educations$ = this.generalsService.getAllConfigs({ key: 'education_levels' }).pipe(
    map((res) => {
      return res.education_levels;
    }),
  );
  cities$: Observable<{ id?: number; name?: string; name_ka?: string }[] | undefined> = this.generalsService
    .getDistrictsList()
    .pipe(map((res) => res.data));
  languages$ = this.generalsService.getAllConfigs({ key: 'languages' }).pipe(map((res) => res.languages));

  onNextClick() {
    this.form()?.markAllAsTouched();
    if (this.form()?.valid) {
      console.log(this.form()?.value);
      this.nextClick.emit();
    }
  }

  handleFileUpload(files: UploadedFile[], abroadKey: string) {
    this.form()?.get(abroadKey)?.patchValue(files);
  }

  toggleSwitcher(event: Event, abroadKey: string) {
    if (this.tokenUser$()?.residential !== 'GEO') {
      this.form()?.get(abroadKey)?.patchValue(event);
    }
  }

  onSpecEnvChange(event: any, specEnv: string) {
    const specEnvControl = this.form()?.get('spec_env');
    if (!specEnvControl) return;

    const currentValue = specEnvControl.value || [];

    if (event.target.checked) {
      specEnvControl.setValue([...currentValue, specEnv]);
    } else {
      specEnvControl.setValue(currentValue.filter((item: string) => item !== specEnv));
    }
  }

  districtChange(event: Event) {
    const dialog: DialogRef = this.dialogService.open({
      title: 'საგამოცდო ქალაქი',
      content:
        'გაითვალისწინეთ, რომ ცენტრის მიერ ორგანიზებული ტესტირების შემთხვევაში, ცენტრი იტოვებს შესაძლებლობას ტესტირების მიზნით, აპლიკანტი გადაანაწილოს სხვა საგამოცდო ქალაქში/მუნიციპალიტეტში.',
      actions: [{ text: 'გავეცანი', themeColor: 'primary' }],
      width: 400,
    });

    dialog.result.subscribe();
  }

  languageChange(event: Event) {
    const dialog: DialogRef = this.dialogService.open({
      title: 'ტესტირების ენა',
      content:
        'გაითვალისწინეთ, რომ რუსული, აზერბაიჯანული ან სომხური ენის არჩევის შემთხვევაში, პროგრამაზე სწავლებას დაიწყებთ ქართული ენის მოდულით',
      actions: [{ text: 'გავეცანი', themeColor: 'primary' }],
      width: 400,
    });

    dialog.result.subscribe();
  }
}
