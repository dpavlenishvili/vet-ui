/* eslint-disable @angular-eslint/no-host-metadata-property */
import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

@Component({
    selector: 'v-ui-form-error',
    standalone: true,
    changeDetection: ChangeDetectionStrategy.OnPush,
    template: ` <ng-content></ng-content>`,
    styleUrls: ['form-error.component.scss'],
    host: {
        '[class.error-message]': 'true',
        '[class.start-0]': 'messageAlignedAtStart',
        '[class.end-0]': '!messageAlignedAtStart',
    },
})
export class FormErrorComponent {
    @Input() messageAlignedAtStart = true;
}
