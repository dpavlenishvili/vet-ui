import { Component, inject, signal, TemplateRef, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ErrorStateMatcher, FormErrorComponent, FormItemComponent, FormLabelDirective } from '@vet/ui/form-item';
import { InputComponent, ValidationErrorPipe } from '@vet/ui/input';
import { CheckboxComponent } from '@vet/ui/checkbox';
import { MessageCardComponent } from '@vet/ui/message-card';
import { TimerComponent, VerificationComponent } from '@vet/ui/verification';
import { RouterLink } from '@angular/router';
import { TranslocoModule } from '@ngneat/transloco';
import { ButtonComponent } from '@vet/ui/button';
import { ResetPasswordService } from '@vet/shared/services';
import { customPatternValidator, mobileNumberValidator, passwordPatternValidator } from '@vet/shared/forms';
import { AuthenticationPageErrorStateMatcher } from '../authentication-page-error-state-matcher';
import { BaseModalComponent, BaseModalService } from '@vet/ui/modals';
import { ErrorCodesEnum } from '@vet/shared/interfaces';

@Component({
    selector: 'lib-features-reset-password',
    standalone: true,
    imports: [
        CommonModule,
        ReactiveFormsModule,
        FormItemComponent,
        InputComponent,
        CheckboxComponent,
        MessageCardComponent,
        VerificationComponent,
        TimerComponent,
        RouterLink,
        FormErrorComponent,
        ValidationErrorPipe,
        FormLabelDirective,
        TranslocoModule,
        ButtonComponent,
        BaseModalComponent,
    ],
    templateUrl: './features-reset-password.component.html',
    styleUrl: './features-reset-password.component.scss',
    providers: [
        {
            provide: ErrorStateMatcher,
            useClass: AuthenticationPageErrorStateMatcher,
        },
    ],
})
export class FeaturesResetPasswordComponent {
    @ViewChild('passwordChangedMessage') passwordChangedMessageTemplateRef?: TemplateRef<void>;
    protected personalNumberControl = new FormControl<string>('', [Validators.required]);
    protected mobileNumberControl = new FormControl<string>('', [Validators.required, mobileNumberValidator]);
    protected verificationNumberControl = new FormControl<string>('', [
        customPatternValidator('^.{4}$', {
            required: true,
        }),
    ]);
    protected passwordControl = new FormControl<string>('', [Validators.required, passwordPatternValidator]);
    protected confirmPasswordControl = new FormControl<string>('', [Validators.required, passwordPatternValidator]);

    resetPasswordForm = new FormGroup({
        personalNumber: this.personalNumberControl,
        mobileNumber: this.mobileNumberControl,
        verificationNumber: this.verificationNumberControl,
        password: this.passwordControl,
        confirmPassword: this.confirmPasswordControl,
    });

    private resetPasswordService = inject(ResetPasswordService);
    private baseModalService = inject(BaseModalService);

    showMobileVerification = signal<boolean>(false);

    resetPassword() {
        if (this.personalNumberControl.valid && this.mobileNumberControl.valid) {
            const data = {
                personalNumber: this.personalNumberControl.value || '',
                mobileNumber: this.mobileNumberControl.value || '',
            };

            this.resetPasswordService.resetPassword(data).subscribe({
                next: (res) => {
                    this.showMobileVerification.set(true);
                    console.log(res);
                },
                error: (err) => {
                    if (err.error.error.code === ErrorCodesEnum.CAN_NOT_FIND_ANY_USER) {
                        this.baseModalService.showErrorModal('მონაცემები არასწორია');
                    }
                },
            });
        } else {
            this.personalNumberControl.markAsTouched();
            this.mobileNumberControl.markAllAsTouched();
        }
    }

    saveNewPassword() {
        if (!this.passwordControl.value || !this.confirmPasswordControl.value) {
            this.passwordControl.markAsTouched();
            this.confirmPasswordControl.markAsTouched();

            return;
        } else if (this.passwordControl.value !== this.confirmPasswordControl.value) {
            this.confirmPasswordControl.setErrors({ passwordsDoNotMatch: true });

            return;
        }

        if (this.resetPasswordForm.valid) {
            const data = {
                personalNumber: this.personalNumberControl.value || '',
                mobileNumber: this.mobileNumberControl.value || '',
                code: this.verificationNumberControl.value || '',
                password: this.passwordControl.value || '',
            };

            this.resetPasswordService.saveNewPassword(data).subscribe({
                next: () => {
                    this.baseModalService.showSuccessModal(this.passwordChangedMessageTemplateRef as TemplateRef<void>);
                },
                error: (err) => {
                    if (err.error.error.code === ErrorCodesEnum.SMS_CODE_HAS_EXPIRED) {
                        this.verificationNumberControl.setErrors({ verificationNumberTimeLimit: true });
                    }
                },
            });
        }
    }
}
