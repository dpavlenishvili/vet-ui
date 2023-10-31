import { Injectable } from '@angular/core';
import { ReplaySubject } from 'rxjs';

@Injectable()
export class RadioButtonService {
    selected$ = new ReplaySubject<any>(1);
    isDisabled$ = new ReplaySubject<boolean>(1);

    setRadioButtonValue(value: any) {
        this.selected$.next(value);
    }

    setIsDisabled(value: boolean) {
        this.isDisabled$.next(value);
    }
}
