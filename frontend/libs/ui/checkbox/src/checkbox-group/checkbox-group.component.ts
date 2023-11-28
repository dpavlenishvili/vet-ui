/* eslint-disable @angular-eslint/no-host-metadata-property */
import { ChangeDetectionStrategy, Component, EventEmitter, forwardRef, inject, Input, Output } from '@angular/core';
import { FormControlProvider } from '@vet/ui/form-item';
import { ControlValueAccessor, NgControl } from '@angular/forms';
import { CheckboxGroup } from './checkbox-group.token';
import { Checkbox } from '../checkbox/checkbox.token';
import { BooleanInput, coerceBooleanProperty } from '@angular/cdk/coercion';

enum CheckboxOrientation {
    HORIZONTAL = 'horizontal',
    VERTICAL = 'vertical',
}

let quantity = 0;

@Component({
    selector: 'v-ui-checkbox-group',
    standalone: true,
    template: ` <ng-content></ng-content> `,
    styleUrls: ['./checkbox-group.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    host: {
        '[class.checkbox-wrapper-flex-row]': 'checkboxOrientation === "horizontal"',
        '[class.checkbox-wrapper-flex-column]': 'checkboxOrientation === "vertical"',
    },
    providers: [
        {
            provide: CheckboxGroup,
            useExisting: forwardRef(() => CheckboxGroupComponent),
        },
        {
            provide: FormControlProvider,
            useExisting: forwardRef(() => CheckboxGroupComponent),
            multi: true,
        },
    ],
})
export class CheckboxGroupComponent<ValueType>
    extends CheckboxGroup<ValueType>
    implements FormControlProvider, ControlValueAccessor
{
    @Input({ transform: coerceBooleanProperty }) multiple: BooleanInput = true;
    @Input({ transform: coerceBooleanProperty }) disabled: BooleanInput = false;
    @Input() id = `v-ui-checkbox-group-${++quantity}`;
    @Input() value: ValueType[] = [];
    @Input() checkboxOrientation: CheckboxOrientation.HORIZONTAL | CheckboxOrientation.VERTICAL =
        CheckboxOrientation.HORIZONTAL;
    @Output() valueChange = new EventEmitter<ValueType[]>();

    ngControl = inject(NgControl, { optional: true });

    constructor() {
        super();
        if (this.ngControl) {
            this.ngControl.valueAccessor = this;
        }
    }

    onChange: (value: ValueType[]) => void = () => {};
    onTouched: () => void = () => {};

    registerOnChange(fn: (value: ValueType[]) => void): void {
        this.onChange = fn;
    }

    registerOnTouched(fn: () => void): void {
        this.onTouched = fn;
    }

    setDisabledState(isDisabled: boolean): void {
        this.disabled = isDisabled;
    }

    writeValue(value?: []): void {
        this.value = value || [];
    }

    checkboxCheckedChange(checkbox: Checkbox<ValueType>, checked: boolean): void {
        if (checkbox.value === undefined) {
            return;
        }
        if (checked) {
            this.value = this.multiple ? [...this.value, checkbox.value] : [checkbox.value];
        } else {
            this.value = this.value.filter((item) => item !== checkbox.value);
        }
        this.onChange(this.value);
        this.valueChange.emit(this.value);
    }
}
