import { Component, computed, effect, forwardRef, input, output, signal, viewChildren } from '@angular/core';
import { NumericTextBoxComponent } from '@progress/kendo-angular-inputs';
import { type ControlValueAccessor, FormsModule, NG_VALUE_ACCESSOR } from '@angular/forms';
import { useAuthEnvironment } from '../../auth.providers';
import { RegistrationPhoneTimeoutComponent } from '../registration-phone-timeout/registration-phone-timeout.component';
import { noop } from 'lodash-es';

@Component({
  selector: 'vet-registration-phone-verification',
  imports: [FormsModule, NumericTextBoxComponent, RegistrationPhoneTimeoutComponent],
  templateUrl: './registration-phone-verification.component.html',
  styleUrl: './registration-phone-verification.component.scss',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => RegistrationPhoneVerificationComponent),
      multi: true,
    },
  ],
  standalone: true,
})
export class RegistrationPhoneVerificationComponent implements ControlValueAccessor {
  isPending = input(false);
  timeSent = input(Date.now());
  reload = output();

  length = useAuthEnvironment().phoneVerificationNumberLength;
  disabled = signal(false);
  digits = signal(this.getDigitsArray());
  input = computed(() =>
    this.digits()
      .map((c) => c ?? '')
      .join(''),
  );
  startTime = signal(this.timeSent());

  private onChange: (value: string) => void = noop;
  private onTouched: () => void = noop;

  protected readonly inputs = viewChildren(NumericTextBoxComponent);
  constructor() {
    effect(() => {
      this.startTime.set(this.timeSent());
    });
    effect(() => {
      const inputList = this.inputs();

      if (inputList.length > 0) {
        inputList[0].hostElement.nativeElement.querySelector('input').focus();
      }
    });
  }

  onKeyDown(event: KeyboardEvent, index: number) {
    const target = event.target as HTMLInputElement;

    if (event.key === 'Backspace' && target.value === '' && index > 0) {
      const prevInput = this.inputs()[index - 1];
      prevInput?.hostElement.nativeElement.querySelector('input')?.focus();
      event.preventDefault();
    }
  }

  onDigitChange(index: number, value: number, input: NumericTextBoxComponent) {
    const element = input.hostElement.nativeElement;
    const nextElement = element.nextElementSibling?.querySelector('input');
    const prevElement = element.previousElementSibling?.querySelector('input');

    this.digits.update((digits) => {
      return digits.map((digit, i) => {
        return i === index ? value : digit;
      });
    });

    const updatedValue = this.input();
    this.onChange(updatedValue);

    if (value === null || value === undefined || (value === 0 && !input.value)) {
      if (prevElement) {
        prevElement.focus();
      }
    } else {
      if (nextElement) {
        nextElement.focus();
      }
    }
  }

  reset() {
    this.startTime.set(Date.now());
    this.writeValue('');
    this.onChange(this.input());
  }

  onSend() {
    this.reset();
    this.reload.emit();
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.disabled.set(isDisabled);
  }

  writeValue(value: string): void {
    const digits = value
      .slice(0, 4)
      .split('')
      .map((c) => parseInt(c));
    this.digits.set(this.getDigitsArray().map((_, i) => digits[i] ?? null));
  }

  private getDigitsArray() {
    return new Array<number | null>(4).fill(null);
  }
}
