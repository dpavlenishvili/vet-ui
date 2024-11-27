import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { TranslocoModule } from '@jsverse/transloco';
import { ButtonModule } from '@progress/kendo-angular-buttons';
import { InputsModule, RadioButtonModule } from '@progress/kendo-angular-inputs';
import { LabelModule } from '@progress/kendo-angular-label';

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
    ],
    templateUrl: './registration-identity-citizen.component.html',
    styleUrl: './registration-identity-citizen.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RegistrationIdentityCitizenComponent {
    form = input<FormGroup<{
        personalNumber: FormControl<string | null>,
        lastname: FormControl<string | null>,
        firstname: FormControl<string | null>,
        dateOfBirth: FormControl<string | null>,
        gender: FormControl<string | null>,
    }>>();
    previousClick = output();
    nextClick = output();

    onPreviousClick() {
        this.previousClick.emit();
    }

    onNextClick() {
        this.nextClick.emit();
    }
}
