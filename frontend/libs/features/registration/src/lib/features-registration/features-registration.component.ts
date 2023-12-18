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
    chooseCitizenshipForm = new FormGroup({
        citizenship: new FormControl(null, [Validators.required]),
    });
    checkIdentityForm = new FormGroup({
        lastname: new FormControl<null | string>(null, [Validators.required]),
        personalNumber: new FormControl<null | string>(null, [
            Validators.required,
            customPatternValidator('^[0-9]{11}$', { personalNumber: true }),
        ]),
        firstname: new FormControl<null | string>(null, [Validators.required]),
        dateOfBirth: new FormControl<null | Date>(null, [Validators.required]),
    });
    checkIdentityForeignerForm = new FormGroup({
        firstname: new FormControl(null, [Validators.required]),
        lastname: new FormControl(null, [Validators.required]),
        personalNumber: new FormControl(null, [Validators.required]),
        dateOfBirth: new FormControl(null),
    });
    mobileForm = new FormGroup({
        mobileNumber: new FormControl(null, [
            Validators.required,
            customPatternValidator('^5\\d{8}$', { mobileNumber: true }),
        ]),
        verificationNumber: new FormControl<null | string>(null, [Validators.required]),
    });
    passwordsForm = new FormGroup({
        password: new FormControl(null, [Validators.required]),
        confirmPassword: new FormControl(null, [Validators.required]),
    });
    termsAndConditionsForm = new FormGroup({
        accepted: new FormControl(null, [Validators.required]),
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

    timer = signal<string>('02:00');
    timerSubscription: Subscription | null = null;

    private destroyRef$ = inject(DestroyRef);
    private registrationService: RegistrationService = inject(RegistrationService);
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
    }

    checkUser() {
        const personalNumberControl = this.checkIdentityForm.get('personalNumber');
        const lastnameControl = this.checkIdentityForm.get('lastname');
        const firstnameControl = this.checkIdentityForm.get('firstname');
        const dateOfBirthControl = this.checkIdentityForm.get('dateOfBirth');

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

                        this.userCheckedSuccessfully.set(true);
                    },
                });
        } else {
            personalNumberControl?.markAsTouched();
            lastnameControl?.markAsTouched();
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

    validateMobileNumber(verificationCode: string, mobileNumber: string) {
        this.registrationService.validateMobile(verificationCode, mobileNumber).subscribe({
            next: (res) => {
                console.log(res);
            },
        });
    }

    onSubmit() {
        console.log(this.registrationForm.value);
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
