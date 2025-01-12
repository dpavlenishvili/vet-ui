import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ButtonComponent } from '@progress/kendo-angular-buttons';
import { LabelComponent } from '@progress/kendo-angular-label';
import { KENDO_INPUTS, TextBoxComponent } from '@progress/kendo-angular-inputs';
import { TranslocoPipe } from '@jsverse/transloco';
import * as kendoIcons from '@progress/kendo-svg-icons';

@Component({
  selector: 'vet-registration-password-create',
  imports: [ButtonComponent, FormsModule, LabelComponent, ReactiveFormsModule, TranslocoPipe, KENDO_INPUTS],
  templateUrl: './registration-password-create.component.html',
  styleUrl: './registration-password-create.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
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
  eyeIcon = kendoIcons.eyeIcon;

  onPreviousClick() {
    this.previousClick.emit();
  }

  onNextClick() {
    const form = this.form();

    if (!form) {
      return;
    }

    if (this.form()?.valid) {
      this.nextClick.emit();
    }
  }

  togglePasswordVisibility(passwordTextBox: TextBoxComponent) {
    const passwordInput = passwordTextBox.input.nativeElement;
    if (passwordInput.type === 'password') {
      passwordInput.type = 'text';
      this.eyeIcon = kendoIcons.eyeSlashIcon;
    } else {
      passwordInput.type = 'password';
      this.eyeIcon = kendoIcons.eyeIcon;
    }
  }
}
