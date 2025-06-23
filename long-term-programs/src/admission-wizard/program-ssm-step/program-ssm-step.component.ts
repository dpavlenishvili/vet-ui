import { ChangeDetectionStrategy, Component, inject, input, OnInit, output, signal } from '@angular/core';
import { FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { InputsModule, RadioButtonModule } from '@progress/kendo-angular-inputs';
import { ButtonModule } from '@progress/kendo-angular-buttons';
import { LabelModule } from '@progress/kendo-angular-label';
import { SVGIconModule } from '@progress/kendo-angular-icons';
import * as kendoIcons from '@progress/kendo-svg-icons';
import { TranslocoPipe } from '@jsverse/transloco';
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
  readonly form = input<ProgramSsmStepFormGroup>();
  readonly nextClick = output();
  readonly previousClick = output();
  protected readonly kendoIcons = kendoIcons;
  protected readonly selectedLanguage = signal<string | null>(null);
  protected readonly maxLengthOfRequirements = 2000;
  private readonly generalsService = inject(GeneralsService);
  protected readonly languages$ = rxResource({
    loader: () => this.generalsService.translate(),
  });

  ngOnInit(): void {
    this.initializeFormState();
  }

  protected onPreviousClick(): void {
    this.previousClick.emit();
  }

  protected onNextClick(): void {
    const form = this.form();
    if (!form) return;

    form.markAllAsTouched();

    const specEdu = form.get('spec_edu')?.value;
    if (!specEdu) {
      this.clearNonSpecEduFields(form);
      this.selectedLanguage.set(null);
    }

    if (form.valid) {
      this.nextClick.emit();
    }
  }

  protected onSelectedLanguageChange(value: string | null): void {
    const form = this.form();
    if (!form) return;

    this.selectedLanguage.set(value);
    form.controls['translate'].reset();
  }

  protected onSpecEduSwitchChange(checked: boolean): void {
    const form = this.form();
    if (!form) return;

    if (checked) {
      this.setRequiredValidators(form);
    } else {
      this.clearNonSpecEduFields(form);
      this.selectedLanguage.set(null);
    }

    form.updateValueAndValidity();
    form.markAsUntouched();
  }

  protected onLanguageSwitchChange(checked: boolean): void {
    const form = this.form();
    if (!form) return;

    const translateSelectControl = form.get('translate_select');
    const translateControl = form.get('translate');

    if (!translateSelectControl) return;

    if (checked) {
      translateSelectControl.markAsUntouched();
      translateSelectControl.setValidators(Validators.required);
    } else {
      translateSelectControl.reset();
      translateControl?.reset();
      this.selectedLanguage.set(null);
      translateSelectControl.removeValidators(Validators.required);
    }

    translateSelectControl.updateValueAndValidity();
    translateControl?.updateValueAndValidity();
  }

  private initializeFormState(): void {
    const form = this.form();
    if (!form) return;

    const translateSelect = form.get('translate_select')?.value;
    this.selectedLanguage.set(translateSelect || null);

    const specEdu = form.get('spec_edu')?.getRawValue();
    this.onSpecEduSwitchChange(specEdu);
  }

  private clearNonSpecEduFields(form: FormGroup): void {
    const excludeControls = ['spec_edu', 'program_ids'];

    Object.keys(form.controls)
      .filter((controlName) => !excludeControls.includes(controlName))
      .forEach((controlName) => {
        const control = form.controls[controlName];
        control.reset();
        control.clearValidators();
        control.updateValueAndValidity();
      });
  }

  private setRequiredValidators(form: FormGroup): void {
    form.get('e_name')?.setValidators(Validators.required);
    form.get('e_lastname')?.setValidators(Validators.required);
    form.get('e_email')?.setValidators(Validators.email);
    form.get('e_phone')?.setValidators([Validators.required, georgianMobileValidator]);
  }
}
