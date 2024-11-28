import { ChangeDetectionStrategy, Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LabelComponent } from '@progress/kendo-angular-label';
import { TextBoxComponent } from '@progress/kendo-angular-inputs';
import { TranslocoPipe } from '@jsverse/transloco';
import { ReactiveFormsModule } from '@angular/forms';
import { ButtonComponent } from '@progress/kendo-angular-buttons';

@Component({
    selector: 'vet-password-forgot',
    standalone: true,
    imports: [CommonModule, LabelComponent, TextBoxComponent, TranslocoPipe, ReactiveFormsModule, ButtonComponent],
    templateUrl: './password-forgot.component.html',
    styleUrl: './password-forgot.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class PasswordForgotComponent {
}
