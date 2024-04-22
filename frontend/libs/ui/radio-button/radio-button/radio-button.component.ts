/* eslint-disable @typescript-eslint/no-empty-function */
import { ChangeDetectionStrategy, Component, computed, HostListener, inject, input, Input } from '@angular/core';
import { RadioButtonGroup } from '../radio-button-group.class';
import { RadioButtonValue } from '../radio-button.value';

let quantity = 0;

@Component({
    selector: 'v-ui-radio-button',
    standalone: true,
    templateUrl: './radio-button.component.html',
    styleUrls: ['./radio-button.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RadioButtonComponent {
    value = input<RadioButtonValue>('');
    isDisabled = input(false);
    @Input() id = `v-ui-radio-button-${++quantity}`;
    @Input() name = '';
    protected radioButtonGroup = inject(RadioButtonGroup);
    protected _checked$ = computed(() => this.radioButtonGroup.value$() === this.value());
    protected _disabled$ = computed(() => this.radioButtonGroup.disabled$() || this.isDisabled());

    @HostListener('click', ['$event'])
    onClick($event: MouseEvent) {
        $event.stopPropagation();
        $event.preventDefault();
        if (this._disabled$() || this._checked$()) {
            return;
        }
        this.radioButtonGroup.setValue(this.value());
    }
}
