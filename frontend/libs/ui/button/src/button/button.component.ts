/* eslint-disable @angular-eslint/no-host-metadata-property,@angular-eslint/component-selector */
import { ChangeDetectionStrategy, Component, Input, ViewEncapsulation } from '@angular/core';

export type ButtonSize = 'sm' | 'm' | 'l';

@Component({
    selector: 'button[v-ui-button]',
    standalone: true,
    template: ` <ng-content></ng-content> `,
    styleUrls: ['./button.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    host: {
        '[class.v-ui-button]': 'true',
        '[class.v-ui-button--primary]': 'color === "primary"',
        '[class.v-ui-button--secondary]': 'color === "secondary"',
        '[class.v-ui-button--small]': 'size === "sm"',
        '[class.v-ui-button--medium]': 'size === "m"',
        '[class.v-ui-button--large]': 'size === "l"',
    },
    encapsulation: ViewEncapsulation.None,
})
export class ButtonComponent {
    @Input() color: 'primary' | 'secondary' = 'primary';
    @Input() size: ButtonSize = 'm';
}
