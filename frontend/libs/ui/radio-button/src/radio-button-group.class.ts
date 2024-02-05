import { Signal } from '@angular/core';
import { RadioButtonValue } from './radio-button.value';

export abstract class RadioButtonGroup {
    abstract value$: Signal<RadioButtonValue | null>;
    abstract disabled$: Signal<boolean>;
    abstract setValue: (val: RadioButtonValue | null) => void;
}
