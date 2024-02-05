/* eslint-disable @typescript-eslint/no-empty-function,@angular-eslint/no-host-metadata-property */
import { AfterViewInit, ChangeDetectionStrategy, Component, forwardRef, inject, Input, signal } from '@angular/core';
import { ControlValueAccessor, NgControl } from '@angular/forms';
import { FormControlProvider, FormItemComponent } from '@vet/ui/form-item';
import { RadioButtonGroup } from '../radio-button-group.class';
import { RadioButtonValue } from '../radio-button.value';

enum RadioOrientation {
    HORIZONTAL = 'horizontal',
    VERTICAL = 'vertical',
}

let quantity = 0;

@Component({
    selector: 'v-ui-radio-button-group',
    standalone: true,
    template: ` <ng-content></ng-content> `,
    styleUrls: ['./radio-button-group.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    host: {
        '[class.radio-button-wrapper-flex-row]': 'radioOrientation === "horizontal"',
        '[class.radio-button-wrapper-flex-column]': 'radioOrientation === "vertical"',
    },
    providers: [
        { provide: RadioButtonGroup, useExisting: RadioButtonGroupComponent },
        {
            provide: FormControlProvider,
            useExisting: forwardRef(() => RadioButtonGroupComponent),
        },
    ],
})
export class RadioButtonGroupComponent
    extends FormControlProvider
    implements ControlValueAccessor, AfterViewInit, RadioButtonGroup
{
    @Input() id = `v-ui-radio-button-group-${++quantity}`;
    @Input() radioOrientation: RadioOrientation.HORIZONTAL | RadioOrientation.VERTICAL = RadioOrientation.HORIZONTAL;

    disabled$ = signal(false);
    value$ = signal<RadioButtonValue | null>(null);

    ngControl = inject(NgControl);

    private formItem = inject(FormItemComponent, { optional: true });

    constructor() {
        super();
        this.ngControl.valueAccessor = this;
    }

    setValue(value: RadioButtonValue | null): void {
        this.value$.set(value);
        this.onChange(value);
    }

    ngAfterViewInit() {
        if (this.formItem) {
            this.formItem.marginBottom = true;
        }
    }

    onChange: (value: RadioButtonValue | null) => void = () => {};
    onTouched: () => void = () => {};

    registerOnChange(fn: (value: RadioButtonValue | null) => void): void {
        this.onChange = fn;
    }

    registerOnTouched(fn: () => void): void {
        this.onTouched = fn;
    }

    setDisabledState(isDisabled: boolean): void {
        this.disabled$.set(isDisabled);
    }

    writeValue(value: RadioButtonValue): void {
        value && this.value$.set(value);
    }
}
