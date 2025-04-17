import { ChangeDetectionStrategy, Component, input, output, signal } from '@angular/core';
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
  resetForm = output();

  kendoIcons = kendoIcons;

  citizenship = Citizenship;
  isWarningVisible = signal(false)

  onNextClick() {
    this.form()?.markAllAsTouched();
    if (this.form()?.valid) {
      this.nextClick.emit();
    } else {
      this.isWarningVisible.set(true);
    }
  }

  onRadioChange(checked: boolean, value: string) {
    if (checked) {
      this.resetForm.emit();
      this.form()?.controls['citizenship'].setValue(value);
      this.form()?.updateValueAndValidity();
    }
  }
}
