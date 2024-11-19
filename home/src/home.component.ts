import { ChangeDetectionStrategy, Component } from '@angular/core';
import { KENDO_BUTTONS } from '@progress/kendo-angular-buttons';
import { KENDO_LAYOUT } from '@progress/kendo-angular-layout';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { NgIf, NgSwitch, NgSwitchCase } from '@angular/common';

@Component({
    selector: 'vet-home',
    standalone: true,
    imports: [KENDO_BUTTONS, KENDO_LAYOUT, ReactiveFormsModule, NgIf, NgSwitch, NgSwitchCase],
    templateUrl: './home.component.html',
    styleUrl: './home.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HomeComponent {
    currentStep = 0;
    steps = [
        { label: 'მოქალაქეობის არჩევა' },
        {
            label: 'პიროვნების გადამოწმება',
        },
        { label: 'მობილურის დადასტურება' },
    ];

    chooseCitizenshipForm: FormGroup;
    checkIdentityForm: FormGroup;

    constructor(private fb: FormBuilder) {
        this.chooseCitizenshipForm = this.fb.group({
            citizenship: ['', Validators.required],
        });

        this.checkIdentityForm = this.fb.group({
            personalNumber: ['', Validators.required],
            lastname: ['', Validators.required],
        });
    }

    goToNextStep() {
        console.log(this.isStepValid(this.currentStep));
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
                return this.checkIdentityForm.valid;
            default:
                return true;
        }
    }

    onStepChange(event: any) {
        if (this.isStepValid(this.currentStep) || event.index < this.currentStep) {
            this.currentStep = event.index;
        } else {
            event.preventDefault();
        }
    }
}
