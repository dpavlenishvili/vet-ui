import { ChangeDetectionStrategy, Component } from '@angular/core';
import { NgSwitch, NgSwitchCase } from '@angular/common';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { KENDO_LAYOUT } from '@progress/kendo-angular-layout';
import { KENDO_BUTTONS } from '@progress/kendo-angular-buttons';
import { KENDO_INPUTS } from '@progress/kendo-angular-inputs';
import { KENDO_LABELS } from '@progress/kendo-angular-label';
import { StepperActivateEvent } from '@progress/kendo-angular-layout/stepper/events/activate-event';
import { RegistrationCitizenshipComponent } from './registration-citizenship/registration-citizenship.component';
import {
    RegistrationIdentityCitizenComponent
} from './registration-identity-citizen/registration-identity-citizen.component';
import { RegistrationPhoneComponent } from './registration-phone/registration-phone.component';
import { TranslocoPipe } from '@jsverse/transloco';
import {
    RegistrationIdentityForeignerComponent
} from './registration-identity-foreigner/registration-identity-foreigner.component';

enum CitizenshipType {
    Georgian = '1',
    Foreigner = '2',
}

@Component({
    selector: 'vet-registration',
    standalone: true,
    imports: [
        KENDO_BUTTONS,
        KENDO_LAYOUT,
        ReactiveFormsModule,
        NgSwitch,
        NgSwitchCase,
        KENDO_INPUTS,
        KENDO_LABELS,
        RegistrationCitizenshipComponent,
        RegistrationIdentityCitizenComponent,
        RegistrationIdentityForeignerComponent,
        RegistrationPhoneComponent,
        TranslocoPipe,
    ],
    templateUrl: './registration.component.html',
    styleUrl: './registration.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RegistrationComponent {
    currentStepIndex = 0;
    formGroup = this.createFormGroup();
    steps = [
        {
            label: 'auth.citizenship_selection',
            title: 'auth.choose_citizenship',
            form: () => this.formGroup.controls.chooseCitizenship,
        },
        {
            label: 'auth.id_verification',
            title: 'auth.fill_in_personal_info',
            form: () =>
                this.citizenship === this.CitizenshipType.Georgian
                    ? this.formGroup.controls.checkIdentity
                    : this.formGroup.controls.checkIdentityForeigner,
        },
        {
            label: 'auth.phone_verification',
            title: 'auth.enter_phone_number',
            form: () => this.formGroup.controls.phone,
        },
        {
            label: 'auth.password_creation',
            title: 'auth.enter_password',
            form: () => this.formGroup.controls.passwords,
        },
        {
            label: 'auth.terms_and_conditions',
            title: 'auth.terms_and_conditions',
            form: () => this.formGroup.controls.termsAndConditions,
        },
    ];
    CitizenshipType = CitizenshipType;

    createFormGroup() {
        return new FormGroup({
            chooseCitizenship: new FormGroup({
                citizenship: new FormControl<string | null>(null, Validators.required),
            }),
            checkIdentity: new FormGroup({
                personalNumber: new FormControl('', Validators.required),
                lastname: new FormControl('', Validators.required),
                firstname: new FormControl('', Validators.required),
                dateOfBirth: new FormControl<Date | null>(null, Validators.required),
                gender: new FormControl('', Validators.required),
            }),
            checkIdentityForeigner: new FormGroup({
                citizenship: new FormControl('', Validators.required),
                lastname: new FormControl('', Validators.required),
                personalNumber: new FormControl('', Validators.required),
                firstname: new FormControl('', Validators.required),
                dateOfBirth: new FormControl<Date | null>(null, Validators.required),
                gender: new FormControl('', Validators.required),
            }),
            phone: new FormGroup({
                phoneNumber: new FormControl('', Validators.required),
                verificationNumber: new FormControl('', Validators.required)
            }),
            passwords: new FormGroup({
                password: new FormControl('', Validators.required),
                confirmPassword: new FormControl('', Validators.required)
            }),
            termsAndConditions: new FormGroup({
                accepted: new FormControl(false, Validators.requiredTrue)
            }),
        });
    }

    get citizenship() {
        return this.formGroup.controls.chooseCitizenship.controls.citizenship.value;
    }

    isStepValid(stepIndex: number): boolean {
        const step = this.steps[stepIndex];

        return step && !!step.form()?.valid;
    }

    onStepChange(event: StepperActivateEvent) {
        if (this.isStepValid(this.currentStepIndex) || event.index < this.currentStepIndex) {
            this.currentStepIndex = event.index;
        } else {
            event.preventDefault();
        }
    }

    onPreviousClick() {
        if (this.currentStepIndex > 0) {
            this.currentStepIndex--;
        }
    }

    onNextClick() {
        console.log('next', this.isStepValid(this.currentStepIndex), this.formGroup.controls.phone.value);
        if (this.isStepValid(this.currentStepIndex)) {
            this.currentStepIndex++;
        }
    }
}
