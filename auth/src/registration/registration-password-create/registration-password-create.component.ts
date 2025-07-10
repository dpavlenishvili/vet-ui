import { ChangeDetectionStrategy, Component, input, output, signal } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ButtonComponent } from '@progress/kendo-angular-buttons';
import { LabelComponent } from '@progress/kendo-angular-label';
import { KENDO_INPUTS } from '@progress/kendo-angular-inputs';
import { TranslocoPipe } from '@jsverse/transloco';
import * as kendoIcons from '@progress/kendo-svg-icons';

@Component({
  selector: 'vet-registration-password-create',
  imports: [ButtonComponent, FormsModule, LabelComponent, ReactiveFormsModule, TranslocoPipe, KENDO_INPUTS],
  templateUrl: './registration-password-create.component.html',
  styleUrl: './registration-password-create.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
})
export class RegistrationPasswordCreateComponent {
  form = input<
    FormGroup<{
      password: FormControl<string | null>;
      confirmPassword: FormControl<string | null>;
    }>
  >();
  previousClick = output();
  nextClick = output();

  
  readonly showPassword = signal(false);
  readonly showConfirmPassword = signal(false);

  
  readonly eyeIcon = kendoIcons.eyeIcon;
  readonly eyeSlashIcon = kendoIcons.eyeSlashIcon;

  onPreviousClick() {
    this.previousClick.emit();
  }

  onNextClick() {
    const form = this.form();

    if (!form) {
      return;
    }

    form.markAllAsTouched();

    if (this.form()?.valid) {
      this.nextClick.emit();
    }
  }

  togglePasswordVisibility(): void {
    this.showPassword.update(current => !current);
  }

  toggleConfirmPasswordVisibility(): void {
    this.showConfirmPassword.update(current => !current);
  }
}
