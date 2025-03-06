import { ChangeDetectionStrategy, Component, inject, input, output, signal } from '@angular/core';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { InputsModule, RadioButtonModule } from '@progress/kendo-angular-inputs';
import { ButtonModule } from '@progress/kendo-angular-buttons';
import { LabelModule } from '@progress/kendo-angular-label';
import { SVGIconModule } from '@progress/kendo-angular-icons';
import * as kendoIcons from '@progress/kendo-svg-icons';
import { TranslocoPipe, TranslocoService } from '@jsverse/transloco';
import { DividerComponent, InfoComponent } from '@vet/shared';
import {
  DropDownListComponent,
  ItemTemplateDirective,
  ValueTemplateDirective
} from '@progress/kendo-angular-dropdowns';
import { NgClass } from '@angular/common';

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
    ValueTemplateDirective
  ],
  templateUrl: './program-ssm-step.component.html',
  styleUrl: './program-ssm-step.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
})
export class ProgramSsmStepComponent {
  form = input<ProgramSsmStepFormGroup>();
  nextClick = output();
  previousClick = output();

  translocoService = inject(TranslocoService);
  kendoIcons = kendoIcons;
  languagePlaceholder = {
    value: null,
    label: this.translocoService.translate('programs.ssm_language_label'),
  };
  languages = [
    {
      value: this.translocoService.translate('programs.ka'),
      label: this.translocoService.translate('programs.ka'),
    },
    {
      value: this.translocoService.translate('programs.en'),
      label: this.translocoService.translate('programs.en'),
    },
    {
      value: 'other',
      label: this.translocoService.translate('programs.other'),
    },
  ];
  selectedLanguage = signal<string | null>(null);
  maxLengthOfRequirements = 2000;

  onPreviousClick() {
    this.previousClick.emit();
  }

  onNextClick() {
    this.form()?.markAllAsTouched();
    if (this.form()?.valid) {
      this.nextClick.emit();
    }
  }

  onSelectedLanguageChange(value: string | null) {
    const form = this.form();

    if (!form) {
      return;
    }

    this.selectedLanguage.set(value);

    if (value === 'other') {
      form.controls['language'].patchValue('');
    } else {
      form.controls['language'].patchValue(value ?? '');
    }
  }
}
