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
import { NgClass } from '@angular/common';
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
    NgClass,
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
  languagePlaceholder = {
    value: null,
    label: this.translocoService.translate('programs.ssm_language_label'),
  };

  languages$ = rxResource({
    loader: () => this.generalsService.translate(),
  });
  selectedLanguage = signal<string | null>(null);
  maxLengthOfRequirements = 2000;

  ngOnInit() {
    this.selectedLanguage.set(this.form()?.get('translate_select')?.value);
  }

  onPreviousClick() {
    this.previousClick.emit();
  }

  onNextClick() {
    const ssmForm = this.form();
    ssmForm?.markAllAsTouched();

    const specEdu = ssmForm?.get('spec_edu')?.value;
    if (!specEdu) {
      ['e_name', 'e_lastname', 'e_phone'].forEach((controlName) => {
        const control = ssmForm?.get(controlName);
        control?.clearValidators();
        control?.updateValueAndValidity();
      });
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
      ssmForm.get('e_name')?.clearValidators();
      ssmForm.get('e_lastname')?.clearValidators();
      ssmForm.get('e_phone')?.clearValidators();
      ssmForm.reset({
        program_ids: [],
      });
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
