/* eslint-disable @angular-eslint/no-host-metadata-property */
import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
    selector: 'v-ui-form-error',
    standalone: true,
    changeDetection: ChangeDetectionStrategy.OnPush,
    template: ` <ng-content></ng-content>`,
    styleUrls: ['form-error.component.scss'],
    host: {
        '[class.error-message]': 'true',
    },
})
export class FormErrorComponent {}
