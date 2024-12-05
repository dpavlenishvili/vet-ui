import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { InputsModule, RadioButtonModule } from '@progress/kendo-angular-inputs';
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
    form = input<
        FormGroup<{
            citizenship: FormControl<string | null>;
        }>
    >();

    nextClick = output();

    onNextClick() {
        this.form()?.markAllAsTouched();
        if (this.form()?.valid) {
            this.nextClick.emit();
        }
    }
}
