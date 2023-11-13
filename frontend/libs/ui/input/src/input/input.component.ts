/* eslint-disable @angular-eslint/no-host-metadata-property */
import { ChangeDetectionStrategy, Component, forwardRef, inject, Input, ViewEncapsulation } from '@angular/core';
import { NgControl } from '@angular/forms';
import { FormControlProvider } from '@vet/ui/form-item';

let quantity = 0;

@Component({
    // eslint-disable-next-line @angular-eslint/component-selector
    selector: 'input[v-ui-input]',
    standalone: true,
    template: '',
    styleUrls: ['./input.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    providers: [
        {
            provide: FormControlProvider,
            useExisting: forwardRef(() => InputComponent),
        },
    ],
    host: {
        '[class.v-ui-input]': 'true',
        '[attr.disabled]': 'isDisabled || null',
        '[attr.aria-disabled]': 'isDisabled || null',
        '[attr.id]': 'id',
    },
    encapsulation: ViewEncapsulation.None,
})
export class InputComponent extends FormControlProvider {
    @Input() id = `v-ui-input-${++quantity}`;
    @Input() placeholder = '';
    @Input() type: 'text' | 'number' | 'password' = 'text';

    isDisabled = false;
    value = '';

    ngControl = inject(NgControl);
}
