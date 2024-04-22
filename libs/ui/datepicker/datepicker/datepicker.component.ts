import {
    ChangeDetectionStrategy,
    ChangeDetectorRef,
    Component,
    EventEmitter,
    inject,
    Input,
    Output,
    ViewEncapsulation,
} from '@angular/core';
import { FormControlProvider } from '../../form-item/form-control-provider';
import { ControlValueAccessor, FormsModule, NgControl } from '@angular/forms';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import { InputComponent } from '../../input/input/input.component';
import { NgIf } from '@angular/common';
import { PopoverModule } from 'ngx-bootstrap/popover';
import { parseDate } from 'ngx-bootstrap/chronos';

let qty = 0;

function getDateValue(date: Date | string | undefined, format: string): Date | undefined {
    if (date === undefined) {
        return undefined;
    }
    if (typeof date === 'string') {
        return parseDate(date, format);
    }
    return date;
}

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
    imports: [BsDatepickerModule, InputComponent, NgIf, PopoverModule, FormsModule],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DatepickerComponent extends FormControlProvider implements ControlValueAccessor {
    @Input() id = `v-ui-datepicker-${++qty}`;
    @Input() format = 'DD/MM/YYYY';
    @Input() placeholder?: string;
    @Input() value?: Date;
    @Output() valueChange = new EventEmitter<Date | undefined>();

    /**
     * The minimum selectable date.
     * Can be Date object or string in format which is used in the datepicker,
     * Default is DD/MM/YYYY
     * @param date
     */
    @Input() set minDate(date: Date | string | undefined) {
        this._minDate = getDateValue(date, this.format);
    }

    /**
     * The maximum selectable date.
     * Can be Date object or string in format which is used in the datepicker,
     * Default is DD/MM/YYYY
     * @param date
     */
    @Input() set maxDate(date: Date | string | undefined) {
        this._maxDate = getDateValue(date, this.format);
    }

    ngControl = inject(NgControl, { optional: true });

    protected disabled = false;
    protected _minDate?: Date;
    protected _maxDate?: Date;
    protected _changeDetectorRef = inject(ChangeDetectorRef);

    constructor() {
        super();
        if (this.ngControl) {
            this.ngControl.valueAccessor = this;
        }
    }

    onChange = (v?: Date) => this.valueChange.emit(v);
    onTouched = Function.prototype;

    writeValue(obj: Date | undefined): void {
        this.value = obj;
        this._changeDetectorRef.detectChanges();
    }

    registerOnChange(fn: (v?: Date) => void): void {
        this.onChange = (v?: Date) => {
            this.valueChange.emit(v);
            fn(v);
        };
    }

    registerOnTouched(fn: () => void): void {
        this.onTouched = fn;
    }

    setDisabledState(isDisabled: boolean): void {
        this.disabled = isDisabled;
    }

    onDateChange(date: Date) {
        this.value = date;
        this.onChange(date);
        this.onTouched();
    }
}
