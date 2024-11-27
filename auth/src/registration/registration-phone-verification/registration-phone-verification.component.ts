import { Component, computed, forwardRef, output, QueryList, signal, ViewChildren } from '@angular/core';
import { NumericTextBoxComponent, TextBoxComponent } from '@progress/kendo-angular-inputs';
import { ControlValueAccessor, FormsModule, NG_VALUE_ACCESSOR } from '@angular/forms';
import { useAuthEnvironment } from '../../auth.injectors';
import { RegistrationPhoneTimeoutComponent } from '../registration-phone-timeout/registration-phone-timeout.component';

@Component({
    selector: 'vet-registration-phone-verification',
    standalone: true,
    imports: [
        TextBoxComponent,
        FormsModule,
        NumericTextBoxComponent,
        RegistrationPhoneTimeoutComponent
    ],
    templateUrl: './registration-phone-verification.component.html',
    styleUrl: './registration-phone-verification.component.scss',
    providers: [{
        provide: NG_VALUE_ACCESSOR,
        useExisting: forwardRef(() => RegistrationPhoneVerificationComponent),
        multi: true
    }]
})
export class RegistrationPhoneVerificationComponent implements ControlValueAccessor {
    reload = output();

    length = useAuthEnvironment().phoneVerificationNumberLength;
    digits = signal(this.getDigitsArray());
    input = computed(() => this.digits().map(c => c ?? '').join(''));

    private onChange: (value: string) => void = () => {
    };

    @ViewChildren(NumericTextBoxComponent)
    set inputs(inputs: QueryList<NumericTextBoxComponent>) {
        const inputList = inputs.toArray();

        if (inputList.length > 0) {
            inputList[0].hostElement.nativeElement.querySelector('input').focus();
        }
    }

    onDigitChange(index: number, value: number, input: NumericTextBoxComponent) {
        const element = input.hostElement.nativeElement;
        const nextElement = element.nextElementSibling?.querySelector('input');

        if (nextElement) {
            nextElement.focus();
        }

        this.digits.update(digits => {
            return digits.map((digit, i) => {
                return i === index ? value : digit;
            });
        });

        this.onChange(this.input());
    }

    onSend() {
        this.writeValue('');
        this.onChange(this.input());
        this.reload.emit();
    }

    registerOnChange(fn: any): void {
        this.onChange = fn;
    }

    registerOnTouched(fn: any): void {
    }

    setDisabledState(isDisabled: boolean): void {
    }

    writeValue(value: string): void {
        const digits = value.slice(0, 4).split('').map(c => parseInt(c));
        this.digits.set(this.getDigitsArray().map((_, i) => digits[i] ?? null));
    }

    private getDigitsArray() {
        return new Array<number | null>(4).fill(null);
    }
}
