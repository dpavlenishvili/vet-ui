import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { TranslocoModule } from '@jsverse/transloco';
import { ButtonModule } from '@progress/kendo-angular-buttons';
import { InputsModule, RadioButtonModule } from '@progress/kendo-angular-inputs';
import { LabelModule } from '@progress/kendo-angular-label';

@Component({
    selector: 'vet-registration-identity',
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
    templateUrl: './registration-identity.component.html',
    styleUrl: './registration-identity.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RegistrationIdentityComponent {
    formGroup = input<FormGroup>();
    citizenship = input<string>();
    next = output();

    additionalFields = false;

    showAdditionalFields() {
        if (this.formGroup()?.get('personalNumber')?.valid && this.formGroup()?.get('lastname')?.valid) {
            this.additionalFields = true;
        } else {
            this.additionalFields = false;
        }
    }

    handleNext() {
        this.next.emit();
    }
}
