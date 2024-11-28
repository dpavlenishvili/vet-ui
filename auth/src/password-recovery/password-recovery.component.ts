import { ChangeDetectionStrategy, Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
    selector: 'vet-password-recovery',
    standalone: true,
    imports: [CommonModule],
    templateUrl: './password-recovery.component.html',
    styleUrl: './password-recovery.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class PasswordRecoveryComponent {
}
