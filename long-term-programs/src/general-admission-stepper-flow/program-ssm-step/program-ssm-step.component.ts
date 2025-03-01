import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { InputsModule, RadioButtonModule } from '@progress/kendo-angular-inputs';
import { ButtonModule } from '@progress/kendo-angular-buttons';
import { LabelModule } from '@progress/kendo-angular-label';
import { SVGIconModule } from '@progress/kendo-angular-icons';
import * as kendoIcons from '@progress/kendo-svg-icons';
import { TranslocoPipe } from '@jsverse/transloco';
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
  nextClick = output();
  previousClick = output();

  form = input<ProgramSsmStepFormGroup>();
  kendoIcons = kendoIcons;
  languagePlaceholder = {
    value: null,
    label: 'programs.ssm_language_label',
  };
  languages = [
    {
      value: 'ka',
      label: 'programs.ka',
    },
    {
      value: 'en',
      label: 'programs.en',
    },
  ];
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
}
