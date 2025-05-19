import { Component, computed, effect, forwardRef, input, model, output, signal, viewChildren } from '@angular/core';
import { ErrorComponent, NumericTextBoxComponent } from '@progress/kendo-angular-inputs';
import { type ControlValueAccessor, FormsModule, NG_VALUE_ACCESSOR } from '@angular/forms';
import { useAuthEnvironment } from '../../auth.providers';
import { RegistrationPhoneTimeoutComponent } from '../registration-phone-timeout/registration-phone-timeout.component';
import { noop } from 'lodash-es';
import { TranslocoPipe } from '@jsverse/transloco';

export type VerificationState = 'default' | 'valid' | 'invalid';

@Component({
  selector: 'vet-registration-phone-verification',
  imports: [FormsModule, NumericTextBoxComponent, RegistrationPhoneTimeoutComponent, ErrorComponent, TranslocoPipe],
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
  errorMessage = model<string | null>(null);
  timeSent = input(Date.now());
  isValid = model<boolean | null>(null);
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
    return this.digits().every((digit) => digit !== null);
  });

  isTouched = signal(false);
  isInvalid = computed(() => (this.isTouched() && !this.isComplete()) || this.isValid() === false);

  private onChange: (value: string) => void = noop;
  public onTouched: () => void = noop;

  protected readonly inputs = viewChildren(NumericTextBoxComponent);

  constructor() {
    effect(() => {
      this.startTime.set(this.timeSent());
    });
  }

  onKeyDown(event: KeyboardEvent, index: number) {
    const target = event.target as HTMLInputElement;

    if (event.key === 'Backspace' && (target.value === '' || target.selectionStart === 0) && index > 0) {
      this.digits.update((digits) => {
        digits[index] = null;
        return [...digits];
      });

      const prevInput = this.inputs()[index - 1];
      if (prevInput) {
        const inputElement = prevInput.hostElement.nativeElement.querySelector('input');
        inputElement?.focus();
        this.digits.update((digits) => {
          digits[index - 1] = null;
          return [...digits];
        });
      }
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

    // Mark as touched when a digit changes
    if (!this.isTouched()) {
      this.isTouched.set(true);
      this.onTouched();
    }

    const inputElements = this.inputs();
    if (value === null) {
      input.hostElement.nativeElement.querySelector('input')?.focus();
    } else {
      const nextEmptyIndex = this.digits().findIndex((d, i) => i > index && d === null);
      if (nextEmptyIndex >= 0 && nextEmptyIndex < inputElements.length) {
        inputElements[nextEmptyIndex].hostElement.nativeElement.querySelector('input')?.focus();
      } else if (index < inputElements.length - 1) {
        inputElements[index + 1].hostElement.nativeElement.querySelector('input')?.focus();
      }
    }
  }

  // Clear all inputs and reset state
  reset() {
    this.startTime.set(Date.now());
    this.writeValue('');
    this.onChange(this.input());
    this.isTouched.set(false);
    this.errorMessage.set(null);
    this.isValid.set(null);
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
    if (value) {
      const digits = value
        .slice(0, this.length)
        .split('')
        .map((c) => parseInt(c));
      this.digits.set(this.getDigitsArray().map((_, i) => digits[i] ?? null));
    } else {
      this.digits.set(this.getDigitsArray());
    }
  }

  private getDigitsArray() {
    return new Array<number | null>(this.length).fill(null);
  }
}
