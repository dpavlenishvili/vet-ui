import { ChangeDetectionStrategy, Component, input, output, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { TranslocoModule } from '@jsverse/transloco';
import { ButtonModule } from '@progress/kendo-angular-buttons';
import { InputsModule, RadioButtonModule } from '@progress/kendo-angular-inputs';
import { LabelModule } from '@progress/kendo-angular-label';
import { KENDO_DATEINPUTS } from '@progress/kendo-angular-dateinputs';
import { KENDO_DROPDOWNS } from '@progress/kendo-angular-dropdowns';
import { RegisterService } from '@vet/backend';
import { tap } from 'rxjs';

@Component({
    selector: 'vet-registration-identity-citizen',
    standalone: true,
    imports: [
        CommonModule,
        ReactiveFormsModule,
        InputsModule,
        RadioButtonModule,
        ButtonModule,
        LabelModule,
        TranslocoModule,
        KENDO_DATEINPUTS,
        KENDO_DROPDOWNS,
    ],
    templateUrl: './registration-identity-citizen.component.html',
    styleUrl: './registration-identity-citizen.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RegistrationIdentityCitizenComponent {
    form = input<
        FormGroup<{
            personalNumber: FormControl<string | null>;
            lastname: FormControl<string | null>;
            firstname: FormControl<string | null>;
            dateOfBirth: FormControl<Date | null>;
            gender: FormControl<string | null>;
        }>
    >();
    gender = ['male', 'female'];
    isPersonVerified = signal(false);
    previousClick = output();
    nextClick = output();

    constructor(private registerService: RegisterService) {}

    onPreviousClick() {
        this.previousClick.emit();
    }

    onCheckClick() {
        const form = this.form()?.value;

        console.log(this.form());
        if (this.form()?.invalid) {
            this.form()?.markAllAsTouched();
            return;
        }

        this.registerService
            .validatePerson({ pid: form?.personalNumber, last_name: form?.lastname })
            .pipe(
                tap((personalInfo) => {
                    this.isPersonVerified.set(true);
                    this.form()?.controls.firstname.setValue(personalInfo.firstName ?? null);
                    this.form()?.controls.dateOfBirth.setValue(
                        personalInfo.birthDate ? new Date(personalInfo.birthDate) : null,
                    );
                    this.form()?.controls.firstname.setValue(personalInfo.firstName ?? null);
                    this.form()?.controls.gender.setValue(personalInfo.gender ?? null);
                }),
            )
            .subscribe();
    }

    onNextClick() {
        this.nextClick.emit();
    }
}
