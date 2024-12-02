import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ButtonComponent } from '@progress/kendo-angular-buttons';
import { LabelComponent } from '@progress/kendo-angular-label';
import { KENDO_CHECKBOX, TextBoxComponent, TextBoxSuffixTemplateDirective } from '@progress/kendo-angular-inputs';
import { TranslocoPipe } from '@jsverse/transloco';

@Component({
    selector: 'vet-registration-terms-and-conditions',
    standalone: true,
    imports: [
        CommonModule,
        ButtonComponent,
        FormsModule,
        LabelComponent,
        ReactiveFormsModule,
        TextBoxComponent,
        TextBoxSuffixTemplateDirective,
        TranslocoPipe,
        KENDO_CHECKBOX,
    ],
    templateUrl: './registration-terms-and-conditions.component.html',
    styleUrl: './registration-terms-and-conditions.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RegistrationTermsAndConditionsComponent {
    form = input<
        FormGroup<{
            accepted: FormControl<boolean | null>;
        }>
    >();
    previousClick = output();
    nextClick = output();

    onPreviousClick() {
        this.previousClick.emit();
    }

    onNextClick() {
        const form = this.form();

        if (!form) {
            return;
        }

        this.nextClick.emit();
    }
}
