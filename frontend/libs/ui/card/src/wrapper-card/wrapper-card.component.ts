import { ChangeDetectionStrategy, Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
    selector: 'v-ui-wrapper-card',
    standalone: true,
    imports: [CommonModule],
    templateUrl: './wrapper-card.component.html',
    styleUrls: ['./wrapper-card.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class WrapperCardComponent {}
