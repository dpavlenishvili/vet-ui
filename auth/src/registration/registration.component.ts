import { ChangeDetectionStrategy, Component } from '@angular/core';
import { NgIf, NgSwitch, NgSwitchCase } from '@angular/common';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { KENDO_LAYOUT } from '@progress/kendo-angular-layout';
import { KENDO_BUTTONS } from '@progress/kendo-angular-buttons';
import { KENDO_INPUTS } from '@progress/kendo-angular-inputs';
import { KENDO_LABELS } from '@progress/kendo-angular-label';
import { StepperActivateEvent } from '@progress/kendo-angular-layout/stepper/events/activate-event';
import { RegistrationCitizenshipComponent } from './registration-citizenship/registration-citizenship.component';
import { RegistrationIdentityComponent } from './registration-identity/registration-identity.component';

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
        NgIf,
        NgSwitch,
        NgSwitchCase,
        KENDO_INPUTS,
        KENDO_LABELS,
        RegistrationCitizenshipComponent,
        RegistrationIdentityComponent,
    ],
    templateUrl: './registration.component.html',
    styleUrl: './registration.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RegistrationComponent {
    currentStep = 0;
    registrationForm: FormGroup;
    steps = [
        { label: 'მოქალაქეობის არჩევა' },
        { label: 'პიროვნების გადამოწმება' },
        { label: 'მობილურის დადასტურება' },
        { label: 'პაროლის შექმნა' },
        { label: 'წესები და პირობები' },
    ];
    citizenshipTypeEnum = CitizenshipType;

    constructor() {
        this.registrationForm = new FormGroup({
            chooseCitizenship: new FormGroup({
                citizenship: new FormControl(null, Validators.required),
            }),
            checkIdentity: new FormGroup({
                personalNumber: new FormControl('', Validators.required),
                lastname: new FormControl('', Validators.required),
                firstname: new FormControl({ value: '', disabled: true }, Validators.required),
                dateOfBirth: new FormControl({ value: null, disabled: true }, Validators.required),
                gender: new FormControl('', Validators.required),
            }),
            checkIdentityForeigner: new FormGroup({
                citizenship: new FormControl('', Validators.required),
                lastname: new FormControl('', Validators.required),
                personalNumber: new FormControl('', Validators.required),
                firstname: new FormControl('', Validators.required),
                dateOfBirth: new FormControl(null, Validators.required),
                gender: new FormControl('', Validators.required),
            }),
            mobile: new FormGroup({
                mobileNumber: new FormControl('', Validators.required),
                verificationNumber: new FormControl('', Validators.required),
            }),
            passwords: new FormGroup({
                password: new FormControl('', Validators.required),
                confirmPassword: new FormControl('', Validators.required),
            }),
            termsAndConditions: new FormGroup({
                accepted: new FormControl(false, Validators.requiredTrue),
            }),
        });
    }

    get chooseCitizenshipForm() {
        return this.registrationForm.get('chooseCitizenship') as FormGroup;
    }

    get checkIdentityForm() {
        return this.registrationForm.get('checkIdentity') as FormGroup;
    }

    get checkIdentityForeignerForm() {
        return this.registrationForm.get('checkIdentityForeigner') as FormGroup;
    }

    get mobileForm() {
        return this.registrationForm.get('mobile') as FormGroup;
    }

    get passwordsForm() {
        return this.registrationForm.get('passwords') as FormGroup;
    }

    get termsAndConditionsForm() {
        return this.registrationForm.get('termsAndConditions') as FormGroup;
    }

    goToNextStep() {
        if (this.isStepValid(this.currentStep)) {
            this.currentStep++;
        }
    }

    goToPreviousStep() {
        this.currentStep--;
    }

    isStepValid(step: number): boolean {
        switch (step) {
            case 0:
                return this.chooseCitizenshipForm.valid;
            case 1:
                if (this.citizenshipTypeEnum.Georgian === this.chooseCitizenshipForm.value.citizenship) {
                    return this.checkIdentityForm.valid;
                } else {
                    return this.checkIdentityForeignerForm.valid;
                }
            case 2:
                return this.mobileForm.valid;
            case 3:
                return this.passwordsForm.valid;
            case 4:
                return this.termsAndConditionsForm.valid;
            default:
                return false;
        }
    }

    onStepChange(event: StepperActivateEvent) {
        if (this.isStepValid(this.currentStep) || event.index < this.currentStep) {
            this.currentStep = event.index;
        } else {
            event.preventDefault();
        }
    }
}
