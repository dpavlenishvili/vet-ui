import { EventEmitter } from '@angular/core';
import { Checkbox } from '../checkbox/checkbox.token';
import { BooleanInput } from '@angular/cdk/coercion';

export abstract class CheckboxGroup<ValueType> {
    abstract value: ValueType[];
    abstract valueChange: EventEmitter<ValueType[]>;
    abstract multiple: BooleanInput;
    abstract disabled: BooleanInput;
    abstract checkboxCheckedChange(checkbox: Checkbox<ValueType>, checked: boolean): void;
}
