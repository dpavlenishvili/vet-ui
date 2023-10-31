/* eslint-disable @typescript-eslint/no-empty-function,@angular-eslint/no-host-metadata-property */
import { ChangeDetectionStrategy, Component, forwardRef, inject, Input } from '@angular/core';
import { ControlValueAccessor, NgControl } from '@angular/forms';
import { RadioButtonService } from '../radio-button.service';
import { FormControlProvider } from '@vet/ui/form-item';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

enum RadioOrientation {
    HORIZONTAL = 'horizontal',
    VERTICAL = 'vertical',
}

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

    onChange: (...args: any) => void = () => {};
    onTouched: (...args: any) => void = () => {};

    registerOnChange(fn: any): void {
        this.onChange = fn;
    }

    registerOnTouched(fn: any): void {
        this.onTouched = fn;
    }

    setDisabledState(isDisabled: boolean): void {
        this.isDisabled = isDisabled;
        this._radioButtonService.setIsDisabled(this.isDisabled);
    }

    writeValue(value: string | number): void {
        value && this._radioButtonService.selected$.next(value);
    }
}
