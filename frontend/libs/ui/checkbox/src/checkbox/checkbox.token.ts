import { EventEmitter } from '@angular/core';
import { BooleanInput } from '@angular/cdk/coercion';
import { CheckboxGroup } from '../checkbox-group/checkbox-group.token';

export abstract class Checkbox<ValueType> {
    abstract value?: ValueType;
    abstract checked: boolean | null; // null for indeterminate state
    abstract checkedChange: EventEmitter<boolean | null>;
    abstract disabled: BooleanInput;
    abstract checkboxGroup: CheckboxGroup<ValueType> | null;

    setChecked(value: boolean | null) {
        if (value !== this.checked) {
            this.checked = value;
            this.checkedChange.emit(value);

            if (this.checkboxGroup) {
                this.checkboxGroup.checkboxCheckedChange(this, !!value);
            }
        }
    }
}
