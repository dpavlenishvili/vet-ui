import {
    AfterViewInit,
    ChangeDetectionStrategy,
    ChangeDetectorRef,
    Component,
    EventEmitter,
    forwardRef,
    inject,
    Input,
    Output,
} from '@angular/core';
import { NgIf } from '@angular/common';
import { SvgIconComponent } from 'angular-svg-icon';
import { ControlValueAccessor, NgControl } from '@angular/forms';
import { Checkbox } from './checkbox.token';
import { FormControlProvider } from '@vet/ui/form-item';
import { CheckboxGroup } from '../checkbox-group/checkbox-group.token';
import { BooleanInput, coerceBooleanProperty } from '@angular/cdk/coercion';

let quantity = 0;

@Component({
    selector: 'v-ui-checkbox',
    standalone: true,
    templateUrl: 'checkbox.component.html',
    styleUrls: ['checkbox.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [NgIf, SvgIconComponent],
    providers: [
        {
            provide: Checkbox,
            useExisting: forwardRef(() => CheckboxComponent),
        },
        {
            provide: FormControlProvider,
            useExisting: forwardRef(() => CheckboxComponent),
        },
    ],
})
export class CheckboxComponent<ValueType>
    extends Checkbox<ValueType>
    implements ControlValueAccessor, FormControlProvider, AfterViewInit
{
    @Input() id = `v-ui-checkbox-${++quantity}`;
    @Input() value?: ValueType;
    @Input() checked: boolean | null = false;
    @Input({ transform: coerceBooleanProperty }) disabled: BooleanInput = false;
    @Output() checkedChange = new EventEmitter<boolean | null>();

    ngControl = inject(NgControl, { optional: true, self: true });
    checkboxGroup: CheckboxGroup<ValueType> | null = inject(CheckboxGroup, { optional: true });
    protected changeDetectorRef = inject(ChangeDetectorRef);

    constructor() {
        super();
        if (this.ngControl) {
            this.ngControl.valueAccessor = this;
        }
    }

    onChange: (value: boolean) => void = () => {};
    onTouched: () => void = () => {};

    registerOnChange(fn: (value: boolean) => void): void {
        this.onChange = fn;
    }

    registerOnTouched(fn: () => void): void {
        this.onTouched = fn;
    }

    setDisabledState(isDisabled: boolean): void {
        this.disabled = isDisabled;
    }

    writeValue(value: boolean | null): void {
        this.checked = value === null ? null : value;
        this.changeDetectorRef.detectChanges();
    }

    checkChange(checked: boolean) {
        this.onTouched();
        this.setChecked(checked);
        this.onChange(checked);
    }

    ngAfterViewInit() {
        if (this.checkboxGroup) {
            this.checked = this.checkboxGroup.value.includes(this.value as unknown as ValueType);
            this.changeDetectorRef.detectChanges();
        }
    }
}
