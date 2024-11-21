import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { InputsModule } from '@progress/kendo-angular-inputs';
import { RadioButtonModule } from '@progress/kendo-angular-inputs';
import { ButtonModule } from '@progress/kendo-angular-buttons';
import { LabelModule } from '@progress/kendo-angular-label';
import { TranslocoModule } from '@jsverse/transloco';

@Component({
    selector: 'vet-registration-citizenship',
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
    templateUrl: './registration-citizenship.component.html',
    styleUrl: './registration-citizenship.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RegistrationCitizenshipComponent {
    formGroup = input<FormGroup>();
    next = output();

    handleNext() {
        this.next.emit();
    }
}
