import { Component, inject, signal } from '@angular/core';
import { FormErrorComponent, FormItemComponent, FormLabelDirective } from '@vet/ui/form-item';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { InputComponent, ValidationErrorPipe } from '@vet/ui/input';
import { CheckboxComponent } from '@vet/ui/checkbox';
import { ButtonComponent } from '@vet/ui/button';
import { RouterLink } from '@angular/router';
import { TranslocoDirective } from '@ngneat/transloco';
import { AuthService, UserLogin2FaResponseBody } from '@vet/backend';
import { customPatternValidator } from '@vet/shared/forms';
import { TimerComponent, VerificationComponent } from '@vet/ui/verification';
import { SvgIconComponent } from 'angular-svg-icon';
import { ErrorCodesEnum } from '@vet/shared/interfaces';
import { BaseModalService } from '@vet/ui/modals';
import { MessageCardComponent } from '@vet/ui/card';

@Component({
    selector: 'lib-features-authentication',
    standalone: true,
    imports: [
        FormItemComponent,
        FormErrorComponent,
        FormLabelDirective,
        FormsModule,
        InputComponent,
        ReactiveFormsModule,
        CheckboxComponent,
        ValidationErrorPipe,
        ButtonComponent,
        RouterLink,
        TranslocoDirective,
        VerificationComponent,
        TimerComponent,
        MessageCardComponent,
        SvgIconComponent,
    ],
    templateUrl: './features-authentication.component.html',
    styleUrl: './features-authentication.component.scss',
})
export class FeaturesAuthenticationComponent {
    protected pidControl = new FormControl<string>('', [Validators.required]);
    protected passwordControl = new FormControl<string>('', [Validators.required]);
    protected rememberControl = new FormControl<boolean>(false);
    protected verificationNumberControl = new FormControl<string>('', [
        customPatternValidator('^.{4}$', {
            required: true,
        }),
    ]);

    authenticationForm = new FormGroup({
        pid: this.pidControl,
        password: this.passwordControl,
        remember: this.rememberControl,
        verificationNumber: this.verificationNumberControl,
    });

    private authenticationService = inject(AuthService);
    private baseModalService = inject(BaseModalService);
    showMobileVerification = signal<boolean>(false);
    twoStepAuthentication!: UserLogin2FaResponseBody;

    signIn() {
        this.verificationNumberControl.setValue('');
        this.verificationNumberControl.markAsUntouched();

        if (this.pidControl.valid && this.passwordControl.valid) {
            const credentials = {
                pid: this.pidControl.value || '',
                password: this.passwordControl.value || '',
                code: this.verificationNumberControl.value || '',
            };

            this.authenticationService.loginUser(credentials).subscribe({
                next: (res) => {
                    if ((res as UserLogin2FaResponseBody).phone_mask) {
                        this.showMobileVerification.set(true);
                        this.twoStepAuthentication = res as UserLogin2FaResponseBody;
                    }
                },
                error: (err) => {
                    if (err.error.error.code === ErrorCodesEnum.USERNAME_OR_PASSWORD_NOT_VALID) {
                        this.baseModalService.showErrorModal('მომხმარებლის სახელი ან პაროლი არასწორია');
                    }

                    if (err.error.error.code === ErrorCodesEnum.PERSON_BLOCKED) {
                        this.baseModalService.showErrorModal(
                            `თქვენი მომხმარებელი დაბლოკილია, განბლოკვის დრო ${Math.ceil(err.error.error.block_expire_in / 60)} წუთი`,
                        );
                    }
                },
            });
        } else {
            this.pidControl.markAsTouched();
            this.passwordControl.markAsTouched();
        }
    }

    verifyMobile() {
        if (
            this.pidControl.valid &&
            this.passwordControl.valid &&
            this.verificationNumberControl.valid &&
            this.showMobileVerification()
        ) {
            this.authenticationService
                .validate2FaCode({
                    pid: this.pidControl.value || '',
                    password: this.passwordControl.value || '',
                    code: this.verificationNumberControl.value || '',
                })
                .subscribe({
                    next: (res) => {
                        // TODO redirect to homepage if authentication is successful
                        console.log(res);
                    },
                    error: (err) => {
                        if (err.error.error.code === ErrorCodesEnum.INVALID_SMS_CODE) {
                            this.verificationNumberControl.setErrors({ verificationNumber: true });
                        } else if (err.error.error.code === ErrorCodesEnum.SMS_CODE_HAS_EXPIRED) {
                            this.verificationNumberControl.setErrors({ verificationNumberTimeLimit: true });
                        }
                    },
                });
        } else {
            this.verificationNumberControl.markAsTouched();
        }
    }
}
