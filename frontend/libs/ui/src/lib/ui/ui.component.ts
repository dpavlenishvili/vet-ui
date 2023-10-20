import { ChangeDetectionStrategy, Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
    selector: 'v-ui-ui',
    standalone: true,
    imports: [CommonModule],
    templateUrl: './ui.component.html',
    styleUrls: ['./ui.component.css'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UiComponent {}
