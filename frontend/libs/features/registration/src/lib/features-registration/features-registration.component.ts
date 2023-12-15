import { ChangeDetectionStrategy, ChangeDetectorRef, Component, DestroyRef, inject, OnInit } from '@angular/core';
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
import { VerificationComponent } from '@vet/ui/verification';

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
    private destroyRef$ = inject(DestroyRef);
    private cdr = inject(ChangeDetectorRef);

    registrationForm = new FormGroup({
        chooseCitizenship: new FormGroup({
            citizenship: new FormControl(null, [Validators.required]),
        }),
        checkIdentity: new FormGroup({
            lastname: new FormControl(null, [Validators.required]),
            personalNumber: new FormControl(null, [
                Validators.required,
                customPatternValidator('^[0-9]{11}$', { personalNumber: true }),
            ]),
            firstname: new FormControl(null, [Validators.required]),
            dateOfBirth: new FormControl(null, [Validators.required]),
        }),
        checkIdentityForeigner: new FormGroup({
            firstname: new FormControl(null, [Validators.required]),
            lastname: new FormControl(null, [Validators.required]),
            personalNumber: new FormControl(null, [Validators.required]),
            dateOfBirth: new FormControl(null),
        }),
        mobile: new FormGroup({
            mobileNumber: new FormControl(null, [
                Validators.required,
                customPatternValidator('^5\\d{8}$', { mobileNumber: true }),
            ]),
            verificationNumber: new FormControl(null, [Validators.required]),
        }),
        passwords: new FormGroup({
            password: new FormControl(null, [Validators.required]),
            repeatPassword: new FormControl(null, [Validators.required]),
        }),
        termsAndConditions: new FormGroup({
            accepted: new FormControl(null, [Validators.required]),
        }),
    });

    citizenshipValue: null | undefined | string = null;

    // TODO remove after integration
    checking = false;
    checkedSuccessfully = false;
    mobileNumberCheckedSuccessfully = false;

    ngOnInit() {
        this.registrationForm
            .get('chooseCitizenship')
            ?.valueChanges.pipe(takeUntilDestroyed(this.destroyRef$))
            .subscribe((res) => {
                this.citizenshipValue = res.citizenship;
            });
    }

    // TODO remove after integration
    checkUser() {
        const personalNumberControl = this.registrationForm.get('checkIdentity')?.get('personalNumber');
        const lastnameControl = this.registrationForm.get('checkIdentity')?.get('lastname');

        if (personalNumberControl?.valid && lastnameControl?.valid) {
            this.checking = true;

            setTimeout(() => {
                this.checking = false;
                this.checkedSuccessfully = true;
                this.cdr.markForCheck();
            }, 1000);
        } else {
            personalNumberControl?.markAsTouched();
            lastnameControl?.markAsTouched();
        }
    }

    // TODO remove after integration
    checkMobile() {
        const mobileNumberControl = this.registrationForm.get('mobile')?.get('mobileNumber');

        if (mobileNumberControl?.valid) {
            this.checking = true;

            setTimeout(() => {
                this.checking = false;
                this.mobileNumberCheckedSuccessfully = true;
                this.cdr.markForCheck();
            }, 1000);
        } else {
            mobileNumberControl?.markAsTouched();
        }
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
