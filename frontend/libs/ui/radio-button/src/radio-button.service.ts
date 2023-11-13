import { Injectable } from '@angular/core';
import { ReplaySubject } from 'rxjs';

export type RadioButtonValue = string | number;

@Injectable()
export class RadioButtonService {
    selected$ = new ReplaySubject<RadioButtonValue>(1);
    isDisabled$ = new ReplaySubject<boolean>(1);

    setRadioButtonValue(value: RadioButtonValue) {
        this.selected$.next(value);
    }

    setIsDisabled(value: boolean) {
        this.isDisabled$.next(value);
    }
}
