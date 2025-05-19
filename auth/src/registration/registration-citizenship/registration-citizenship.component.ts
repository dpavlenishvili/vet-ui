import { ChangeDetectionStrategy, Component, computed, input, output, signal } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { InputsModule, RadioButtonModule } from '@progress/kendo-angular-inputs';
import { ButtonModule } from '@progress/kendo-angular-buttons';
import { LabelModule } from '@progress/kendo-angular-label';
import { TranslocoPipe } from '@jsverse/transloco';
import { SVGIconModule } from '@progress/kendo-angular-icons';
import * as kendoIcons from '@progress/kendo-svg-icons';
import { Citizenship } from '@vet/shared';

@Component({
  selector: 'vet-registration-citizenship',
  imports: [
    ReactiveFormsModule,
    InputsModule,
    RadioButtonModule,
    ButtonModule,
    LabelModule,
    TranslocoPipe,
    SVGIconModule,
  ],
  templateUrl: './registration-citizenship.component.html',
  styleUrl: './registration-citizenship.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
})
export class RegistrationCitizenshipComponent {
  form = input<
    FormGroup<{
      citizenship: FormControl<string | null>;
    }>
  >();
  nextClick = output();
  resetForm = output<string>();

  kendoIcons = kendoIcons;
  citizenship = Citizenship;

  isFormTouched = signal(this.form()?.touched);
  isFormValid = signal(this.form()?.valid);
  isWarningVisible = computed(() => this.isFormTouched() && !this.isFormValid());

  onNextClick() {
    const form = this.form();
    if (!form) return;

    form.markAllAsTouched();
    this.isFormTouched.set(true);
    this.isFormValid.set(form.valid);
    if (form.valid) {
      this.nextClick.emit();
    }
  }

  onRadioChange(checked: boolean, value: string) {
    if (checked) {
      this.isFormTouched.set(true);
      this.isFormValid.set(true);
      this.resetForm.emit(value);
      this.form()?.controls['citizenship'].setValue(value);
      this.form()?.updateValueAndValidity();
    }
  }
}
