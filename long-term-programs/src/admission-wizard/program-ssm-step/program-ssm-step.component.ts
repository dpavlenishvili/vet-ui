import { ChangeDetectionStrategy, Component, inject, input, OnInit, output, signal } from '@angular/core';
import { FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { InputsModule, RadioButtonModule } from '@progress/kendo-angular-inputs';
import { ButtonModule } from '@progress/kendo-angular-buttons';
import { LabelModule } from '@progress/kendo-angular-label';
import { SVGIconModule } from '@progress/kendo-angular-icons';
import * as kendoIcons from '@progress/kendo-svg-icons';
import { TranslocoPipe, TranslocoService } from '@jsverse/transloco';
import { DividerComponent, georgianMobileValidator, InfoComponent } from '@vet/shared';
import {
  DropDownListComponent,
  ItemTemplateDirective,
  ValueTemplateDirective,
} from '@progress/kendo-angular-dropdowns';
import { GeneralsService } from '@vet/backend';
import { rxResource } from '@angular/core/rxjs-interop';

export type ProgramSsmStepFormGroup = FormGroup;

@Component({
  selector: 'vet-program-ssm-step',
  imports: [
    ReactiveFormsModule,
    InputsModule,
    RadioButtonModule,
    ButtonModule,
    LabelModule,
    SVGIconModule,
    TranslocoPipe,
    InfoComponent,
    DividerComponent,
    DropDownListComponent,
    ItemTemplateDirective,
    ValueTemplateDirective,
  ],
  templateUrl: './program-ssm-step.component.html',
  styleUrl: './program-ssm-step.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProgramSsmStepComponent implements OnInit {
  form = input<ProgramSsmStepFormGroup>();
  nextClick = output();
  previousClick = output();

  translocoService = inject(TranslocoService);
  generalsService = inject(GeneralsService);
  kendoIcons = kendoIcons;

  languages$ = rxResource({
    loader: () => this.generalsService.translate(),
  });
  selectedLanguage = signal<string | null>(null);
  maxLengthOfRequirements = 2000;

  ngOnInit() {
    this.selectedLanguage.set(this.form()?.get('translate_select')?.value);
    this.onSpecEduSwitchChange(this.form()?.get('spec_edu')?.getRawValue());
  }

  onPreviousClick() {
    this.previousClick.emit();
  }

  onNextClick() {
    const ssmForm = this.form();
    ssmForm?.markAllAsTouched();

    const specEdu = ssmForm?.get('spec_edu')?.value;
    if (!specEdu && ssmForm) {
      const excludeControls = ['spec_edu', 'program_ids'];

      Object.keys(ssmForm.controls)
        .filter(controlName => !excludeControls.includes(controlName))
        .forEach(controlName => {
          const control = ssmForm.controls[controlName];
          control.reset();
          control.clearValidators();
          control.updateValueAndValidity();
        });
      this.selectedLanguage.set(null);
    }

    if (ssmForm?.valid) {
      this.nextClick.emit();
    }
  }

  onSelectedLanguageChange(value: string | null) {
    const form = this.form();

    if (!form) {
      return;
    }

    this.selectedLanguage.set(value);
    form.controls['translate'].reset();
  }

  onSpecEduSwitchChange(checked: boolean) {
    const ssmForm = this.form();
    if (!ssmForm) return;

    if (checked) {
      ssmForm.get('e_name')?.setValidators(Validators.required);
      ssmForm.get('e_lastname')?.setValidators(Validators.required);
      ssmForm.get('e_phone')?.setValidators([Validators.required, georgianMobileValidator]);
    } else {
      const excludeControls = ['spec_edu', 'program_ids'];

      Object.keys(ssmForm.controls)
        .filter(controlName => !excludeControls.includes(controlName))
        .forEach(controlName => {
          const control = ssmForm.controls[controlName];
          control.reset();
          control.clearValidators();
          control.updateValueAndValidity();
        });
      this.selectedLanguage.set(null);
    }

    ssmForm.updateValueAndValidity();
    ssmForm.markAsUntouched();
  }

  onLanguageSwitchChange(checked: boolean) {
    const translateSelectControl = this.form()?.get('translate_select');
    const translateControl = this.form()?.get('translate');

    if (!translateSelectControl) return;

    if (checked) {
      translateSelectControl?.markAsUntouched();
      translateSelectControl?.setValidators(Validators.required);
    } else {
      translateSelectControl.reset();
      translateControl?.reset();
      this.selectedLanguage.set(null);
      translateSelectControl?.removeValidators(Validators.required);
    }
    translateSelectControl.updateValueAndValidity();
    translateControl?.updateValueAndValidity();
  }
}
