import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { TranslocoModule } from '@jsverse/transloco';
import { ButtonModule } from '@progress/kendo-angular-buttons';
import { SVGIconModule } from '@progress/kendo-angular-icons';
import { InputsModule } from '@progress/kendo-angular-inputs';
import { LabelModule } from '@progress/kendo-angular-label';
import { CardModule } from '@progress/kendo-angular-layout';
import * as kendoIcons from '@progress/kendo-svg-icons';

@Component({
    selector: 'vet-user-password-change',
    standalone: true,
    imports: [
        CommonModule,
        CardModule,
        ButtonModule,
        InputsModule,
        LabelModule,
        SVGIconModule,
        TranslocoModule,
        ReactiveFormsModule,
    ],
    templateUrl: './user-password-change.component.html',
    styleUrl: './user-password-change.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UserPasswordChangeComponent {
    kendoIcons = kendoIcons;
    onSave = output();

    form = input<
        FormGroup<{
            password: FormControl<string | null>;
            password_confirmation: FormControl<string | null>;
            new_password: FormControl<string | null>;
        }>
    >();

    handleSave() {
        this.onSave.emit();
    }
}
