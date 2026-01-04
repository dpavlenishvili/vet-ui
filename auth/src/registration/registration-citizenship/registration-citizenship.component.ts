import { ChangeDetectionStrategy, Component, computed, input, output } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { TranslocoPipe } from '@jsverse/transloco';
import { Citizenship } from '@vet/shared/utils';
import { IconComponent } from '@vet/shared/ui-components';

@Component({
  selector: 'vet-registration-citizenship',
  imports: [ReactiveFormsModule, TranslocoPipe, IconComponent],
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
  resetForm = output<string>();

  citizenship = Citizenship;

  isFormTouched = computed(() => this.form()?.touched ?? false);
  isFormValid = computed(() => this.form()?.valid ?? false);
  isWarningVisible = computed(() => this.isFormTouched() && !this.isFormValid());

  onRadioChange(checked: boolean, value: string) {
    if (checked) {
      this.resetForm.emit(value);
      // Form control value is already set by formControlName binding
      this.form()?.updateValueAndValidity();
    }
  }
}
