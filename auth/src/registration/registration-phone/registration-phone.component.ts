import { ChangeDetectionStrategy, Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
    selector: 'vet-registration-phone',
    standalone: true,
    imports: [CommonModule],
    templateUrl: './registration-phone.component.html',
    styleUrl: './registration-phone.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class RegistrationPhoneComponent {
}
