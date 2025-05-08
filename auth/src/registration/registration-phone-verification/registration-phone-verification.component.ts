import { Component, computed, effect, forwardRef, input, output, signal, viewChildren } from '@angular/core';
import { NumericTextBoxComponent } from '@progress/kendo-angular-inputs';
import { type ControlValueAccessor, FormsModule, NG_VALUE_ACCESSOR } from '@angular/forms';
import { useAuthEnvironment } from '../../auth.providers';
import { RegistrationPhoneTimeoutComponent } from '../registration-phone-timeout/registration-phone-timeout.component';
import { noop } from 'lodash-es';

export type VerificationState = 'default' | 'valid' | 'invalid';

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
  isValid = input<boolean | null>(null);
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
  state = computed<VerificationState>(() => {
    if (this.isValid() === true) return 'valid';
    if (this.isValid() === false) return 'invalid';
    return 'default';
  });

  isComplete = computed(() => {
    return this.digits().every(digit => digit !== null);
  });

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
        const emptyIndex = this.digits().findIndex(d => d === null);
        const focusIndex = emptyIndex >= 0 ? emptyIndex : 0;
        if (focusIndex < inputList.length) {
          inputList[focusIndex].hostElement.nativeElement.querySelector('input').focus();
        }
      }
    });
  }

  onKeyDown(event: KeyboardEvent, index: number) {
    const target = event.target as HTMLInputElement;

    if (event.key === 'Backspace' && target.value === '' && index > 0) {
      this.digits.update(digits => {
        digits[index] = null;
        return [...digits];
      });

      const prevInput = this.inputs()[index - 1];
      prevInput?.hostElement.nativeElement.querySelector('input')?.focus();
      event.preventDefault();
    }
  }

  onDigitChange(index: number, value: number | null, input: NumericTextBoxComponent) {
    if (value !== null && (value < 0 || value > 9)) {
      value = Math.abs(value) % 10;
    }

    this.digits.update((digits) => {
      const newDigits = [...digits];
      newDigits[index] = value;
      return newDigits;
    });

    const updatedValue = this.input();
    this.onChange(updatedValue);
    this.onTouched();

    const element = input.hostElement.nativeElement;
    const inputElements = this.inputs();

    if (value === null) {
      element.querySelector('input')?.focus();
    } else {
      const nextEmptyIndex = this.digits().findIndex((d, i) => i > index && d === null);
      if (nextEmptyIndex >= 0 && nextEmptyIndex < inputElements.length) {
        inputElements[nextEmptyIndex].hostElement.nativeElement.querySelector('input')?.focus();
      } else if (index < inputElements.length - 1) {
        inputElements[index + 1].hostElement.nativeElement.querySelector('input')?.focus();
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
