import { ChangeDetectionStrategy, Component, DestroyRef, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ButtonComponent } from '@vet/ui/button';
import { RadioButtonComponent, RadioButtonGroupComponent } from '@vet/ui/radio-button';
import { AbstractControl, FormControl, FormGroup, ReactiveFormsModule, ValidatorFn, Validators } from '@angular/forms';
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

@Component({
    selector: 'lib-features-registration',
    standalone: true,
    imports: [
        CommonModule,
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

    chooseCitizenshipForm = new FormGroup({
        citizenship: new FormControl<string>('', [Validators.required]),
    });
    checkIdentityForm = new FormGroup({
        lastname: new FormControl<string>('', [Validators.required]),
        personalNumber: new FormControl<string>('', [
            Validators.required,
            customPatternValidator('^[0-9]{11}$', { personalNumber: true }),
        ]),
        firstname: new FormControl<string>({ value: '', disabled: true }, [Validators.required]),
        dateOfBirth: new FormControl<null | Date>({ value: null, disabled: true }, [Validators.required]),
        gender: new FormControl<string>('', [Validators.required]),
    });
    checkIdentityForeignerForm = new FormGroup({
        citizenship: new FormControl<string>('', [Validators.required]),
        lastname: new FormControl<string>('', [Validators.required]),
        personalNumber: new FormControl<string>('', [Validators.required]),
        firstname: new FormControl<string>('', [Validators.required]),
        dateOfBirth: new FormControl<null | Date>(null),
        gender: new FormControl<string>('', [Validators.required]),
    });
    mobileForm = new FormGroup({
        mobileNumber: new FormControl<string>('', [
            Validators.required,
            customPatternValidator('^5\\d{8}$', { mobileNumber: true }),
        ]),
        verificationNumber: new FormControl<string>('', [Validators.required]),
    });
    passwordsForm = new FormGroup({
        password: new FormControl<string>('', [
            Validators.required,
            customPatternValidator('^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[@$!%*?&])[A-Za-z\\d@$!%*?&]{8,}$', {
                passwordPattern: true,
            }),
        ]),
        confirmPassword: new FormControl<string>('', [
            Validators.required,
            customPatternValidator('^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[@$!%*?&])[A-Za-z\\d@$!%*?&]{8,}$', {
                passwordPattern: true,
            }),
        ]),
    });
    termsAndConditionsForm = new FormGroup({
        accepted: new FormControl<boolean>(false, [Validators.required]),
    });
    registrationForm = new FormGroup({
        chooseCitizenship: this.chooseCitizenshipForm,
        checkIdentity: this.checkIdentityForm,
        checkIdentityForeigner: this.checkIdentityForeignerForm,
        mobile: this.mobileForm,
        passwords: this.passwordsForm,
        termsAndConditions: this.termsAndConditionsForm,
    });
    citizenshipValue: null | undefined | string = null;

    userCheckedSuccessfully = signal<boolean>(false);
    smsSent = signal<boolean>(false);
    mobileVerified = signal<boolean>(false);

    timer = signal<string>('02:00');
    timerSubscription: Subscription | null = null;

    countries = countries;
    genders = genders;

    exclamationPointIcon = EXCLAMATION_POINT_ICON;

    ngOnInit() {
        this.registrationForm
            .get('chooseCitizenship')
            ?.valueChanges.pipe(takeUntilDestroyed(this.destroyRef$))
            .subscribe((res) => {
                this.citizenshipValue = res.citizenship;
            });

        this.registrationForm
            .get('mobile')
            ?.get('verificationNumber')
            ?.valueChanges.pipe(takeUntilDestroyed(this.destroyRef$))
            .subscribe({
                next: (smsCode) => {
                    const mobileNumber = this.registrationForm.get('mobile')?.get('mobileNumber')?.value;

                    if (smsCode && smsCode.length === 4 && mobileNumber) {
                        this.validateMobileNumber(smsCode, mobileNumber);
                    }
                },
            });

        this.listenToCheckIdentityFields();
    }

    listenToCheckIdentityFields() {
        this.checkIdentityForm
            ?.get('personalNumber')
            ?.valueChanges.pipe(takeUntilDestroyed(this.destroyRef$))
            .subscribe({
                next: () => {
                    this.userCheckedSuccessfully.set(false);
                },
            });

        this.checkIdentityForm
            ?.get('lastname')
            ?.valueChanges.pipe(takeUntilDestroyed(this.destroyRef$))
            .subscribe({
                next: () => {
                    this.userCheckedSuccessfully.set(false);
                },
            });
    }

    checkGeorgianUser() {
        const personalNumberControl = this.checkIdentityForm.get('personalNumber');
        const lastnameControl = this.checkIdentityForm.get('lastname');
        const firstnameControl = this.checkIdentityForm.get('firstname');
        const dateOfBirthControl = this.checkIdentityForm.get('dateOfBirth');
        const genderControl = this.checkIdentityForm.get('gender');

        if (
            personalNumberControl?.valid &&
            lastnameControl?.valid &&
            personalNumberControl.value &&
            lastnameControl.value
        ) {
            this.registrationService
                .checkUser({
                    personalNumber: personalNumberControl.value,
                    lastName: lastnameControl.value,
                })
                .subscribe({
                    next: (res) => {
                        firstnameControl?.setValue(res.firstName);
                        dateOfBirthControl?.setValue(new Date(res.birthDate));
                        genderControl?.setValue(res.gender);

                        this.userCheckedSuccessfully.set(true);
                    },
                });
        } else {
            personalNumberControl?.markAsTouched();
            lastnameControl?.markAsTouched();
        }
    }

    checkForeignUser(next: () => void) {
        // Foreigner controls
        const foreignerPersonalNumberControl = this.checkIdentityForeignerForm.get('personalNumber');
        const foreignerFirstnameControl = this.checkIdentityForeignerForm.get('firstname');
        const foreignerLastnameControl = this.checkIdentityForeignerForm.get('lastname');

        // Georgian citizen controls
        const citizenshipControl = this.chooseCitizenshipForm.get('citizenship');
        const personalNumberControl = this.checkIdentityForm.get('personalNumber');
        const lastnameControl = this.checkIdentityForm.get('lastname');
        const firstnameControl = this.checkIdentityForm.get('firstname');
        const dateOfBirthControl = this.checkIdentityForm.get('dateOfBirth');

        foreignerPersonalNumberControl?.markAsTouched();
        foreignerFirstnameControl?.markAsTouched();
        foreignerLastnameControl?.markAsTouched();

        if (
            foreignerPersonalNumberControl?.valid &&
            foreignerLastnameControl?.valid &&
            foreignerPersonalNumberControl.value &&
            foreignerLastnameControl.value
        ) {
            this.registrationService
                .checkUser({
                    personalNumber: foreignerPersonalNumberControl.value,
                    lastName: foreignerLastnameControl.value,
                })
                .subscribe({
                    next: (res) => {
                        citizenshipControl?.setValue('1');
                        personalNumberControl?.setValue(foreignerPersonalNumberControl?.value);
                        lastnameControl?.setValue(foreignerLastnameControl?.value);
                        firstnameControl?.setValue(res.firstName);
                        dateOfBirthControl?.setValue(new Date(res.birthDate));

                        next();

                        this.checkIdentityForeignerForm.reset();
                    },
                    error: (err) => {
                        if (err.error.error.code === 1008) {
                            next();
                        }
                    },
                });
        }
    }

    sendSMS() {
        const mobileNumberControl = this.mobileForm.get('mobileNumber');

        if (mobileNumberControl?.valid) {
            this.timerSubscription?.unsubscribe();
            this.startTimer();

            if (mobileNumberControl.value) {
                this.registrationService.sendSMS(mobileNumberControl.value).subscribe({
                    next: (res) => {
                        res.status && this.smsSent.set(true);
                    },
                });
            }
        } else {
            mobileNumberControl?.markAsTouched();
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
                    this.mobileForm.get('verificationNumber')?.setErrors({ verificationNumber: true });
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

            this.timer.set(minutes + ':' + seconds);

            --timer;
            if (timer < 0) {
                this.timerSubscription?.unsubscribe();
            }
        });
    }

    confirmPassword(next: () => void) {
        const password = this.passwordsForm.get('password');
        const confirmPassword = this.passwordsForm.get('confirmPassword');

        if (!password?.value || !confirmPassword?.value) {
            password?.markAsTouched();
            confirmPassword?.markAsTouched();

            return;
        } else if (password?.value !== confirmPassword?.value) {
            confirmPassword.setErrors({ passwordsDoNotMatch: true });
            return;
        }

        next();
    }

    onSubmit() {
        const termsAndConditionsAcceptedControl = this.termsAndConditionsForm.get('accepted');

        if (termsAndConditionsAcceptedControl?.value && this.registrationForm.valid) {
            const user: CreateUser = {
                pid:
                    this.checkIdentityForm.get('personalNumber')?.value ||
                    this.checkIdentityForeignerForm.get('personalNumber')?.value ||
                    '',
                phone: this.mobileForm.get('mobileNumber')?.value || '',
                first_name:
                    this.checkIdentityForm.get('firstname')?.value ||
                    this.checkIdentityForeignerForm.get('firstname')?.value ||
                    '',
                last_name:
                    this.checkIdentityForm.get('lastname')?.value ||
                    this.checkIdentityForeignerForm.get('lastname')?.value ||
                    '',
                gender:
                    this.checkIdentityForm.get('gender')?.value ||
                    this.checkIdentityForeignerForm.get('gender')?.value ||
                    '',
                birth_date:
                    this.checkIdentityForm.get('dateOfBirth')?.value?.toISOString().split('T')[0] ||
                    this.checkIdentityForeignerForm.get('dateOfBirth')?.value?.toISOString().split('T')[0] ||
                    '',
                residential: this.citizenshipValue === '1' ? 'GE' : 'US',
                sms_code: this.mobileForm.get('verificationNumber')?.value || '',
                password: this.passwordsForm.get('password')?.value || '',
                password_confirmation: this.passwordsForm.get('confirmPassword')?.value || '',
            };

            this.registrationService.registerUser(user).subscribe();
        } else {
            termsAndConditionsAcceptedControl?.markAsTouched();
        }
    }
}

// TODO Move custom pattern validator to validators library
function customPatternValidator(pattern: string, error: { [key: string]: boolean }): ValidatorFn {
    const regex = new RegExp(pattern);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return (control: AbstractControl): { [key: string]: any } | null => {
        return regex.test(control.value) ? null : error;
    };
}
