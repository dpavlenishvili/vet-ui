import { ChangeDetectionStrategy, Component, inject, input, OnInit, output, signal } from '@angular/core';
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
  changeDetection: ChangeDetectionStrategy.OnPush
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
    form.controls['translate'].reset();
  }

  onSpecEduSwitchChange(checked: boolean) {
    if (!this.form()) return;

    if (!checked) {
      this.form()?.reset({
        program_ids: [],
      });
      this.form()?.updateValueAndValidity();
    }
  }
}
