import { ChangeDetectionStrategy, Component, inject, input, OnInit, output, signal } from '@angular/core';
import { FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { InputsModule, RadioButtonModule } from '@progress/kendo-angular-inputs';
import { ButtonModule } from '@progress/kendo-angular-buttons';
import { LabelModule } from '@progress/kendo-angular-label';
import { SVGIconModule } from '@progress/kendo-angular-icons';
import { TranslocoPipe } from '@jsverse/transloco';
import { KENDO_DROPDOWNLIST } from '@progress/kendo-angular-dropdowns';
import { AsyncPipe } from '@angular/common';
import { GeneralsService } from '@vet/backend';
import { FileUploadComponent, kendoIcons } from '@vet/shared';
import { map, Observable } from 'rxjs';
import { CustomAuthService } from '@vet/auth';

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
export class ProgramGeneralInformationStepComponent implements OnInit {
  nextClick = output();

  form = input<ProgramGeneralInformationStepFormGroup>();
  kendoIcons = kendoIcons;

  tokenUser$ = inject(CustomAuthService).tokenUser$;

  isSpecEnvEnabled = false;
  isAbroadEnabled = false;
  isOcuEnabled = false;

  generalsService = inject(GeneralsService);

  educations$ = this.generalsService.getAllConfigs().pipe(
    map((res) =>
      Object.entries(res.education_levels).map(([key, value]) => ({
        id: key,
        name: value,
      })),
    ),
  );
  cities$: Observable<{ id?: number; name?: string; name_ka?: string }[] | undefined> = this.generalsService
    .getDistrictsList()
    .pipe(map((res) => res.data));
  languages$ = this.generalsService.getAllConfigs().pipe(map((res) => res.languages));

  onNextClick() {
    console.log(this.form()?.value);
    // this.form()?.markAllAsTouched();
    // if (this.form()?.valid) {
    //   this.nextClick.emit();
    // }
  }

  ngOnInit() {}

  handleFileUpload(event: string) {
    console.log(event);
  }
}
