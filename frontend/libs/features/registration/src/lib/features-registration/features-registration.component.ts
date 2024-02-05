import { ChangeDetectionStrategy, Component, DestroyRef, inject, OnInit, signal } from '@angular/core';
import { NgClass } from '@angular/common';
import { ButtonComponent } from '@vet/ui/button';
import { RadioButtonComponent, RadioButtonGroupComponent } from '@vet/ui/radio-button';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ErrorStateMatcher, FormErrorComponent, FormItemComponent, FormLabelDirective } from '@vet/ui/form-item';
import { InputComponent } from '@vet/ui/input';
import { TranslocoModule } from '@ngneat/transloco';
import { ValidationErrorPipe } from '@vet/ui/input';
import { CheckboxComponent, CheckboxGroupComponent } from '@vet/ui/checkbox';
import {
    WizardComponent,
    WizardStepComponent,
    WizardStepContentDirective,
    WizardStepControlContentDirective,
    WizardStepFooterDirective,
} from '@vet/ui/wizard';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { DatepickerComponent } from '@vet/ui/datepicker';
import { SvgIconComponent } from 'angular-svg-icon';
import { RegistrationPageErrorStateMatcher } from './registration-page-error-state-matcher';
import { RegistrationService } from '@vet/shared/services';
import { VerificationComponent } from '@vet/ui/verification';
import { interval, Subscription } from 'rxjs';
import { EXCLAMATION_POINT_ICON } from '@vet/shared';
import { NgSelectModule } from '@ng-select/ng-select';
import { DropdownComponent } from '@vet/ui/dropdown';
import { countries, genders } from '@vet/shared/constants';
import { CreateUser } from '@vet/shared/interfaces';
import {
    customPatternValidator,
    georgianLettersValidator,
    mobileNumberValidator,
    passwordPatternValidator,
    personalNumberValidator,
} from '@vet/shared/forms';

enum CitizenshipType {
    Georgian = '1',
    Foreigner = '2',
}

@Component({
    selector: 'lib-features-registration',
    standalone: true,
    imports: [
        RadioButtonComponent,
        RadioButtonGroupComponent,
        ReactiveFormsModule,
        FormItemComponent,
        FormErrorComponent,
        InputComponent,
        TranslocoModule,
        ValidationErrorPipe,
        FormLabelDirective,
        ButtonComponent,
        CheckboxComponent,
        CheckboxGroupComponent,
        WizardComponent,
        WizardStepComponent,
        WizardStepContentDirective,
        WizardStepControlContentDirective,
        WizardStepFooterDirective,
        DatepickerComponent,
        SvgIconComponent,
        VerificationComponent,
        NgSelectModule,
        DropdownComponent,
        NgClass,
    ],
    templateUrl: './features-registration.component.html',
    styleUrls: ['./features-registration.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    providers: [
        {
            provide: ErrorStateMatcher,
            useClass: RegistrationPageErrorStateMatcher,
        },
    ],
})
export class FeaturesRegistrationComponent implements OnInit {
    private destroyRef$ = inject(DestroyRef);
    private registrationService: RegistrationService = inject(RegistrationService);

    protected citizenshipTypeEnum = CitizenshipType;

    protected citizenshipControl = new FormControl<CitizenshipType>(CitizenshipType.Georgian, [Validators.required]);

    // Georgian User Controls
    protected georgianCitizenLastnameControl = new FormControl<string>('', [
        Validators.required,
        georgianLettersValidator,
    ]);
    protected georgianCitizenPersonalNumberControl = new FormControl<string>('', [
        Validators.required,
        personalNumberValidator,
    ]);
    protected georgianCitizenFirstnameControl = new FormControl<string>({ value: '', disabled: true }, [
        Validators.required,
    ]);
    protected georgianCitizenDateOfBirthControl = new FormControl<null | Date>({ value: null, disabled: true }, [
        Validators.required,
    ]);
    protected georgianCitizenGenderControl = new FormControl<string>('', [Validators.required]);

    // Foreigner User Controls
    protected foreignerCitizenshipControl = new FormControl<string>('', [Validators.required]);
    protected foreignerLastnameControl = new FormControl<string>('', [Validators.required, georgianLettersValidator]);
    protected foreignerPersonalNumberControl = new FormControl<string>('', [Validators.required]);
    protected foreignerFirstnameControl = new FormControl<string>('', [Validators.required, georgianLettersValidator]);
    protected foreignerDateOfBirthControl = new FormControl<null | Date>(null, [Validators.required]);
    protected foreignerGenderControl = new FormControl<string>('', [Validators.required]);
    protected foreignerCheckedControl = new FormControl<boolean | null>(null, [Validators.required]);

    // Mobile Number Controls
    protected mobileNumberControl = new FormControl<string>('', [Validators.required, mobileNumberValidator]);
    protected verificationNumberControl = new FormControl<string>('', [
        customPatternValidator('^.{4}$', {
            required: true,
        }),
    ]);

    // Password Controls
    protected passwordControl = new FormControl<string>('', [Validators.required, passwordPatternValidator]);
    protected confirmPasswordControl = new FormControl<string>('', [Validators.required, passwordPatternValidator]);

    // Terms and Conditions Controls
    protected termsAndConditionsAcceptedControl = new FormControl<boolean>(false, [Validators.required]);

    chooseCitizenshipForm = new FormGroup({
        citizenship: this.citizenshipControl,
    });
    checkIdentityForm = new FormGroup({
        lastname: this.georgianCitizenLastnameControl,
        personalNumber: this.georgianCitizenPersonalNumberControl,
        firstname: this.georgianCitizenFirstnameControl,
        dateOfBirth: this.georgianCitizenDateOfBirthControl,
        gender: this.georgianCitizenGenderControl,
    });
    checkIdentityForeignerForm = new FormGroup({
        citizenship: this.foreignerCitizenshipControl,
        lastname: this.foreignerLastnameControl,
        personalNumber: this.foreignerPersonalNumberControl,
        firstname: this.foreignerFirstnameControl,
        dateOfBirth: this.foreignerDateOfBirthControl,
        gender: this.foreignerGenderControl,
        checked: this.foreignerCheckedControl,
    });
    mobileForm = new FormGroup({
        mobileNumber: this.mobileNumberControl,
        verificationNumber: this.verificationNumberControl,
    });
    passwordsForm = new FormGroup({
        password: this.passwordControl,
        confirmPassword: this.confirmPasswordControl,
    });
    termsAndConditionsForm = new FormGroup({
        accepted: this.termsAndConditionsAcceptedControl,
    });

    registrationForm = new FormGroup({
        chooseCitizenship: this.chooseCitizenshipForm,
        checkIdentity: this.checkIdentityForm,
        checkIdentityForeigner: this.checkIdentityForeignerForm,
        mobile: this.mobileForm,
        passwords: this.passwordsForm,
        termsAndConditions: this.termsAndConditionsForm,
    });
    citizenshipValue: null | undefined | CitizenshipType = null;

    userCheckedSuccessfully = signal<boolean>(false);
    smsSent = signal<boolean>(false);
    mobileVerified = signal<boolean>(false);
    enableResendSMS = signal<boolean>(false);
    timer = signal<string>('02:00');
    timerSubscription: Subscription | null = null;

    countries = countries;
    genders = genders;

    exclamationPointIcon = EXCLAMATION_POINT_ICON;

    ngOnInit() {
        this.citizenshipControl.valueChanges.pipe(takeUntilDestroyed(this.destroyRef$)).subscribe((res) => {
            this.citizenshipValue = res;
        });

        this.verificationNumberControl.valueChanges.pipe(takeUntilDestroyed(this.destroyRef$)).subscribe((smsCode) => {
            const mobileNumber = this.mobileNumberControl.value;

            if (smsCode && smsCode.length === 4 && mobileNumber) {
                this.validateMobileNumber(smsCode, mobileNumber);
            }

            this.mobileVerified.set(false);
        });

        this.checkIdentityForm.valueChanges.pipe(takeUntilDestroyed(this.destroyRef$)).subscribe(() => {
            if (
                this.georgianCitizenPersonalNumberControl.hasError('personCouldNotBeIdentified') ||
                this.georgianCitizenLastnameControl.hasError('personCouldNotBeIdentified')
            ) {
                this.georgianCitizenPersonalNumberControl.setErrors({ personCouldNotBeIdentified: false });
                this.georgianCitizenLastnameControl.setErrors({ personCouldNotBeIdentified: false });

                this.georgianCitizenPersonalNumberControl.updateValueAndValidity();
                this.georgianCitizenLastnameControl.updateValueAndValidity();
            }
        });

        this.resetFormsIfPreviousValuesChanged();

        this.listenToCheckIdentityFields();
    }

    resetFormsIfPreviousValuesChanged() {
        this.citizenshipControl.valueChanges.pipe(takeUntilDestroyed(this.destroyRef$)).subscribe(() => {
            this.checkIdentityForm.reset();
            this.checkIdentityForeignerForm.reset();
        });

        this.georgianCitizenPersonalNumberControl.valueChanges
            .pipe(takeUntilDestroyed(this.destroyRef$))
            .subscribe(() => {
                if (this.mobileNumberControl.valid || this.verificationNumberControl.valid) {
                    this.georgianCitizenFirstnameControl.reset();
                    this.georgianCitizenDateOfBirthControl.reset();
                    this.georgianCitizenGenderControl.reset();

                    this.mobileForm.reset();

                    this.smsSent.set(false);
                    this.mobileVerified.set(false);
                }
            });

        this.georgianCitizenLastnameControl.valueChanges.pipe(takeUntilDestroyed(this.destroyRef$)).subscribe(() => {
            if (this.mobileNumberControl.valid || this.verificationNumberControl.valid) {
                this.georgianCitizenFirstnameControl.reset();
                this.georgianCitizenDateOfBirthControl.reset();
                this.georgianCitizenGenderControl.reset();

                this.mobileForm.reset();

                this.smsSent.set(false);
                this.mobileVerified.set(false);
            }
        });

        this.foreignerLastnameControl.valueChanges.pipe(takeUntilDestroyed(this.destroyRef$)).subscribe(() => {
            if (this.mobileNumberControl.valid || this.verificationNumberControl.valid) {
                this.foreignerCheckedControl.setValue(null);
                this.mobileForm.reset();

                this.smsSent.set(false);
                this.mobileVerified.set(false);
            }
        });

        this.foreignerPersonalNumberControl.valueChanges.pipe(takeUntilDestroyed(this.destroyRef$)).subscribe(() => {
            if (this.mobileNumberControl.valid || this.verificationNumberControl.valid) {
                this.foreignerCheckedControl.setValue(null);
                this.mobileForm.reset();

                this.smsSent.set(false);
                this.mobileVerified.set(false);
            }
        });

        this.mobileNumberControl.valueChanges.pipe(takeUntilDestroyed(this.destroyRef$)).subscribe(() => {
            if (this.passwordControl.valid || this.confirmPasswordControl.valid) {
                this.verificationNumberControl.setValue('');
                this.verificationNumberControl.markAsUntouched();
                this.mobileVerified.set(false);

                // Reset password fields
                this.passwordControl.reset();
                this.confirmPasswordControl.reset();

                // Reset terms and conditions
                this.termsAndConditionsAcceptedControl.setValue(false);
            }
        });
    }

    listenToCheckIdentityFields() {
        this.georgianCitizenPersonalNumberControl.valueChanges
            .pipe(takeUntilDestroyed(this.destroyRef$))
            .subscribe(() => {
                this.userCheckedSuccessfully.set(false);
            });

        this.georgianCitizenLastnameControl.valueChanges.pipe(takeUntilDestroyed(this.destroyRef$)).subscribe(() => {
            this.userCheckedSuccessfully.set(false);
        });
    }

    checkGeorgianUser() {
        if (
            this.georgianCitizenPersonalNumberControl.valid &&
            this.georgianCitizenLastnameControl.valid &&
            this.georgianCitizenPersonalNumberControl.value &&
            this.georgianCitizenLastnameControl.value
        ) {
            this.registrationService
                .checkUser({
                    personalNumber: this.georgianCitizenPersonalNumberControl.value,
                    lastName: this.georgianCitizenLastnameControl.value,
                })
                .subscribe({
                    next: (res) => {
                        this.georgianCitizenFirstnameControl.setValue(res.firstName);
                        this.georgianCitizenDateOfBirthControl.setValue(new Date(res.birthDate));
                        this.georgianCitizenGenderControl.setValue(res.gender);

                        this.userCheckedSuccessfully.set(true);
                    },
                    error: (err) => {
                        if (err.error.error.code === 1008) {
                            this.georgianCitizenPersonalNumberControl.setErrors({ personCouldNotBeIdentified: true });
                            this.georgianCitizenLastnameControl.setErrors({ personCouldNotBeIdentified: true });
                        }
                    },
                });
        } else {
            this.georgianCitizenPersonalNumberControl.markAsTouched();
            this.georgianCitizenLastnameControl.markAsTouched();
        }
    }

    checkForeignUser(next: () => void) {
        this.foreignerPersonalNumberControl.markAsTouched();
        this.foreignerFirstnameControl.markAsTouched();
        this.foreignerLastnameControl.markAsTouched();
        this.foreignerDateOfBirthControl.markAsTouched();
        this.foreignerCitizenshipControl.markAsTouched();
        this.foreignerGenderControl.markAsTouched();

        if (
            this.foreignerPersonalNumberControl.valid &&
            this.foreignerLastnameControl.valid &&
            this.foreignerPersonalNumberControl.value &&
            this.foreignerLastnameControl.value
        ) {
            this.registrationService
                .checkUser({
                    personalNumber: this.foreignerPersonalNumberControl.value,
                    lastName: this.foreignerLastnameControl.value,
                })
                .subscribe({
                    next: (res) => {
                        this.citizenshipControl.setValue(CitizenshipType.Georgian);
                        this.georgianCitizenPersonalNumberControl.setValue(this.foreignerPersonalNumberControl.value);
                        this.georgianCitizenLastnameControl.setValue(this.foreignerLastnameControl.value);
                        this.georgianCitizenFirstnameControl.setValue(res.firstName);
                        this.georgianCitizenDateOfBirthControl.setValue(new Date(res.birthDate));
                        this.foreignerCheckedControl.setValue(true);

                        next();

                        this.checkIdentityForeignerForm.reset();
                    },
                    error: (err) => {
                        if (err.error.error.code === 1008) {
                            this.foreignerCheckedControl.setValue(true);
                            next();
                        }
                    },
                });
        }
    }

    sendSMS() {
        this.verificationNumberControl.setValue('');
        this.verificationNumberControl.markAsUntouched();

        if (this.mobileNumberControl.valid) {
            this.timerSubscription?.unsubscribe();
            this.startTimer();

            if (this.mobileNumberControl.value) {
                this.registrationService.sendSMS(this.mobileNumberControl.value).subscribe({
                    next: (res) => {
                        res.status && this.smsSent.set(true);
                    },
                });
            }
        } else {
            this.mobileNumberControl.markAsTouched();
        }
    }

    validateMobileNumber(verificationCode: string, mobileNumber: string) {
        this.registrationService.validateMobile(verificationCode, mobileNumber).subscribe({
            next: (res) => {
                if (res.status) {
                    this.mobileVerified.set(true);
                }
            },
            error: (err) => {
                if (err.error.error.code === 1004) {
                    this.verificationNumberControl.setErrors({ verificationNumber: true });
                } else if (err.error.error.code === 1005) {
                    this.verificationNumberControl.setErrors({ verificationNumberTimeLimit: true });
                }
            },
        });
    }

    startTimer() {
        let timer = 120;
        let minutes;
        let seconds;

        this.timerSubscription = interval(1000).subscribe(() => {
            minutes = Math.floor(timer / 60);
            seconds = Math.floor(timer % 60);

            minutes = minutes < 10 ? '0' + minutes : minutes;
            seconds = seconds < 10 ? '0' + seconds : seconds;

            if (minutes > '00') {
                this.enableResendSMS.set(false);
            } else {
                this.enableResendSMS.set(true);
            }

            this.timer.set(minutes + ':' + seconds);

            --timer;
            if (timer < 0) {
                this.timerSubscription?.unsubscribe();
            }
        });
    }

    confirmPassword(next: () => void) {
        if (!this.passwordControl.value || !this.confirmPasswordControl.value) {
            this.passwordControl.markAsTouched();
            this.confirmPasswordControl.markAsTouched();

            return;
        } else if (this.passwordControl.value !== this.confirmPasswordControl.value) {
            this.confirmPasswordControl.setErrors({ passwordsDoNotMatch: true });
            return;
        }

        next();
    }

    onSubmit() {
        if (this.termsAndConditionsAcceptedControl.value) {
            const user: CreateUser = {
                pid: this.georgianCitizenPersonalNumberControl.value || this.foreignerPersonalNumberControl.value || '',
                phone: this.mobileNumberControl.value || '',
                first_name: this.georgianCitizenFirstnameControl.value || this.foreignerFirstnameControl.value || '',
                last_name: this.georgianCitizenLastnameControl.value || this.foreignerLastnameControl.value || '',
                gender: this.georgianCitizenGenderControl.value || this.foreignerGenderControl.value || '',
                birth_date:
                    this.georgianCitizenDateOfBirthControl.value?.toISOString().split('T')[0] ||
                    this.foreignerDateOfBirthControl.value?.toISOString().split('T')[0] ||
                    '',
                residential:
                    this.citizenshipValue === CitizenshipType.Georgian
                        ? 'GE'
                        : this.foreignerCitizenshipControl.value || '',
                sms_code: this.verificationNumberControl.value || '',
                password: this.passwordControl.value || '',
                password_confirmation: this.confirmPasswordControl.value || '',
            };

            this.registrationService.registerUser(user).subscribe({
                next: () => {
                    // TODO remove after homepage implemented
                    window.location.reload();
                },
            });
        } else {
            this.termsAndConditionsAcceptedControl.markAsTouched();
        }
    }
}
