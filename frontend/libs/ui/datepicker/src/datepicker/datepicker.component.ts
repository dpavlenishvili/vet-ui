import { Component, inject, Input, ViewEncapsulation } from '@angular/core';
import { FormControlProvider } from '@vet/ui/form-item';
import { ControlValueAccessor, NgControl } from '@angular/forms';
import { BsDatepickerModule } from "ngx-bootstrap/datepicker";

let qty = 0;

@Component({
    selector: 'v-ui-datepicker',
    templateUrl: './datepicker.component.html',
    styleUrls: ['./datepicker.component.scss'],
    standalone: true,
    providers: [
        {
            provide: FormControlProvider,
            useExisting: DatepickerComponent,
        },
    ],
    encapsulation: ViewEncapsulation.None,
    imports: [
        BsDatepickerModule
    ]
})
export class DatepickerComponent extends FormControlProvider implements ControlValueAccessor {
    @Input() id = `v-ui-datepicker-${++qty}`;
    ngControl = inject(NgControl, { optional: true });

    constructor() {
        super();
        if (this.ngControl) {
            this.ngControl.valueAccessor = this;
        }
    }

    writeValue(obj: any): void {
        throw new Error('Method not implemented.');
    }

    registerOnChange(fn: any): void {
        throw new Error('Method not implemented.');
    }

    registerOnTouched(fn: any): void {
        throw new Error('Method not implemented.');
    }

    setDisabledState?(isDisabled: boolean): void {
        throw new Error('Method not implemented.');
    }
}
