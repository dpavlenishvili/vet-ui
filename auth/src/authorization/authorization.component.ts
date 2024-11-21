import { ChangeDetectionStrategy, Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
    selector: 'vet-authorization',
    standalone: true,
    imports: [CommonModule],
    templateUrl: './authorization.component.html',
    styleUrl: './authorization.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AuthorizationComponent {}
