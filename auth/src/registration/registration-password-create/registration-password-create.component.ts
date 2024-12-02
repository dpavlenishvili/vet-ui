import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ButtonComponent } from '@progress/kendo-angular-buttons';
import { DatePickerComponent } from '@progress/kendo-angular-dateinputs';
import { LabelComponent } from '@progress/kendo-angular-label';
import { KENDO_INPUTS, TextBoxComponent } from '@progress/kendo-angular-inputs';
import { TranslocoPipe } from '@jsverse/transloco';
import * as kendoIcons from '@progress/kendo-svg-icons';

@Component({
    selector: 'vet-registration-password-create',
    standalone: true,
    imports: [
        CommonModule,
        ButtonComponent,
        DatePickerComponent,
        FormsModule,
        LabelComponent,
        ReactiveFormsModule,
        TranslocoPipe,
        KENDO_INPUTS,
    ],
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

        this.nextClick.emit();
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
