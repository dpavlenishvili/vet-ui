/* eslint-disable @typescript-eslint/no-empty-function,@angular-eslint/no-host-metadata-property */
import { ChangeDetectionStrategy, Component, forwardRef, inject, Input } from '@angular/core';
import { ControlValueAccessor, NgControl } from '@angular/forms';
import { RadioButtonService, RadioButtonValue } from '../radio-button.service';
import { FormControlProvider } from '@vet/ui/form-item';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

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
        RadioButtonService,
        {
            provide: FormControlProvider,
            useExisting: forwardRef(() => RadioButtonGroupComponent),
        },
    ],
})
export class RadioButtonGroupComponent extends FormControlProvider implements ControlValueAccessor {
    @Input() id = `v-ui-radio-button-group-${++quantity}`;
    @Input() radioOrientation: RadioOrientation.HORIZONTAL | RadioOrientation.VERTICAL = RadioOrientation.HORIZONTAL;

    isDisabled = false;
    ngControl = inject(NgControl);

    protected _radioButtonService = inject(RadioButtonService);

    constructor() {
        super();
        this.ngControl.valueAccessor = this;
        this._radioButtonService.selected$.pipe(takeUntilDestroyed()).subscribe((value) => {
            this.onChange(value);
        });
    }

    onChange: (value: RadioButtonValue) => void = () => {};
    onTouched: () => void = () => {};

    registerOnChange(fn: (value: RadioButtonValue) => void): void {
        this.onChange = fn;
    }

    registerOnTouched(fn: () => void): void {
        this.onTouched = fn;
    }

    setDisabledState(isDisabled: boolean): void {
        this.isDisabled = isDisabled;
        this._radioButtonService.setIsDisabled(this.isDisabled);
    }

    writeValue(value: RadioButtonValue): void {
        value && this._radioButtonService.selected$.next(value);
    }
}
