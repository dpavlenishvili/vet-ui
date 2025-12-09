import {
  ChangeDetectionStrategy,
  Component,
  computed,
  DestroyRef,
  ElementRef,
  HostListener,
  inject,
  input,
  OnInit,
  signal,
  viewChild,
} from '@angular/core';
import { ControlValueAccessor, FormsModule, NgControl } from '@angular/forms';
import { noop } from 'lodash-es';
import { TranslocoPipe } from '@jsverse/transloco';
import { vetIcons } from '../../shared.icons';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { tap } from 'rxjs';
import { DatePickerComponent as KendoDatePickerComponent } from '@progress/kendo-angular-dateinputs';
import {
  useDefaultDisplayDateFormat,
  useDefaultDateFormat,
  useDefaultDisplayDateSeparator,
  useKendoDatePickerFormat,
} from '../../shared.injectors';
import { InputComponent, InputVersion } from '../input';
import dayjs from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat';

dayjs.extend(customParseFormat);

@Component({
  selector: 'vet-date-picker',
  imports: [TranslocoPipe, FormsModule, KendoDatePickerComponent, InputComponent],
  templateUrl: './date-picker.component.html',
  styleUrl: './date-picker.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
})
export class DatePickerComponent implements ControlValueAccessor, OnInit {
  version = input<InputVersion>('thin');
  placeholder = input('');
  label = input('');
  floatingLabel = input('');
  readonly = input(false);
  dense = input(false);
  min = input<string | null | undefined>('');
  max = input<string | null | undefined>('');
  disabled = input(false);
  error = input<string | null>(null);

  ngControl = inject(NgControl, { optional: true, self: true });
  destroyRef = inject(DestroyRef);
  elementRef = inject(ElementRef);
  value = signal<Date | null>(null);
  isDisabled = signal(false);
  displayValue = signal<string | null>(null);
  textBox = viewChild(InputComponent);
  datePicker = viewChild(KendoDatePickerComponent);
  defaultDisplayDateFormat = useDefaultDisplayDateFormat();
  defaultDisplayDateSeparator = useDefaultDisplayDateSeparator();
  defaultDateFormat = useDefaultDateFormat();
  kendoDatePickerFormat = useKendoDatePickerFormat();
  vetIcons = vetIcons;
  private onChange: (value: Date | null) => void = noop;
  private onTouched: () => void = noop;

  hasError = signal(false);
  private validationTrigger = signal(0);

  errorMessage = computed(() => {
    const _error = this.error();

    if (_error) {
      return _error;
    }

    // Force recomputation when validation state changes
    this.validationTrigger();

    const control = this.ngControl?.control;

    if (!control?.errors) {
      return '';
    }

    const errors = control.errors;
    const keys = Object.keys(errors);

    // Prioritize non-required errors when the field has a value
    const hasValue = control.value !== null && control.value !== '' && control.value !== undefined;
    const error = hasValue
      ? (keys.find((key) => key !== 'required' && errors[key]) ?? keys.find((key) => errors[key]))
      : keys.find((key) => errors[key]);

    return `errors.${error ?? 'required'}`;
  });

  private toDateOrNull(value: any): Date | null {
    if (!value || value === '') {
      return null;
    }

    if (value instanceof Date) {
      return value;
    }

    if (typeof value === 'string') {
      const parsed = dayjs(value, this.defaultDateFormat);
      return parsed.isValid() ? parsed.toDate() : null;
    }

    return null;
  }

  minDate = computed<Date>(() => {
    const minValue = this.min();
    const maxValue = this.max();
    const minDateParsed = this.toDateOrNull(minValue);
    const maxDateParsed = this.toDateOrNull(maxValue);

    if (!minDateParsed) {
      return new Date(1900, 0, 1);
    }

    if (maxDateParsed && minDateParsed > maxDateParsed) {
      return new Date(1900, 0, 1);
    }

    return minDateParsed;
  });

  maxDate = computed<Date>(() => {
    const maxValue = this.max();
    const minValue = this.min();
    const maxDateParsed = this.toDateOrNull(maxValue);
    const minDateParsed = this.toDateOrNull(minValue);

    if (!maxDateParsed) {
      return new Date(2099, 11, 31);
    }

    if (minDateParsed && maxDateParsed < minDateParsed) {
      return new Date(2099, 11, 31);
    }

    return maxDateParsed;
  });

  constructor() {
    if (this.ngControl) {
      this.ngControl.valueAccessor = this;
    }
  }

  ngOnInit() {
    const control = this.ngControl?.control;

    if (control) {
      this.updateErrorState();
      control.statusChanges
        .pipe(
          takeUntilDestroyed(this.destroyRef),
          tap(() => this.updateErrorState()),
        )
        .subscribe();
    }
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.isDisabled.set(isDisabled);
  }

  writeValue(value: string | number | Date | null): void {
    this.setValue(value);
  }

  handleChange(value: Date | null) {
    const resolvedValue = this.setValue(value);
    this.onChange?.(resolvedValue);
    this.onTouched();
  }

  private setValue(value: string | number | Date | null) {
    if (!value) {
      this.value.set(null);
      this.displayValue.set(null);
      return null;
    }

    const resolvedValue = value instanceof Date ? value : dayjs(value, this.defaultDateFormat).toDate();

    this.value.set(resolvedValue);
    this.displayValue.set(dayjs(resolvedValue).format(this.defaultDisplayDateFormat));

    return resolvedValue;
  }

  onDisplayValueChange(value: string | null): void {
    if (!value) {
      this.value.set(null);
      this.displayValue.set(null);
      this.onChange?.(null);
      this.onTouched();
      return;
    }

    const digitsOnly = value.replace(/\D/g, '');
    let formattedValue = '';

    if (digitsOnly.length > 0) {
      formattedValue = digitsOnly.substring(0, 2);

      if (digitsOnly.length >= 3) {
        formattedValue += this.defaultDisplayDateSeparator + digitsOnly.substring(2, 4);
      }

      if (digitsOnly.length >= 5) {
        formattedValue += this.defaultDisplayDateSeparator + digitsOnly.substring(4, 8);
      }
    }

    if (this.displayValue() !== formattedValue) {
      this.displayValue.set(formattedValue);
    }

    if (digitsOnly.length === 8) {
      const date = dayjs(formattedValue, this.defaultDisplayDateFormat, true);

      if (date.isValid()) {
        const dateValue = date.toDate();
        this.value.set(dateValue);
        this.onChange?.(dateValue);
        this.onTouched();

        // Force Kendo DatePicker to update its internal state
        const picker = this.datePicker();
        if (picker) {
          // Use writeValue to ensure internal state is synced
          picker.writeValue(dateValue);
          if (picker.isOpen) {
            picker.toggle(false);
          }
        }
      } else {
        if (this.value() !== null) {
          this.value.set(null);
          this.onChange?.(null);
        }
      }
    } else {
      if (this.value() !== null) {
        this.value.set(null);
        this.onChange?.(null);
      }
    }
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent): void {
    const datePicker = this.datePicker();
    if (!datePicker || !datePicker.isOpen) {
      return;
    }

    const componentElement = this.elementRef.nativeElement as HTMLElement;
    const datePickerPopupElement = datePicker.popupRef?.popupElement as HTMLElement;
    const path = event.composedPath ? event.composedPath() : [];
    const clickedInsideComponent = path.includes(componentElement) || componentElement.contains(event.target as Node);
    const clickedInsidePopup =
      datePickerPopupElement &&
      (path.includes(datePickerPopupElement) ||
        datePickerPopupElement.contains(event.target as Node) ||
        (event.target as HTMLElement).closest?.(
          '.k-calendar, .k-calendar-container, kendo-calendar, kendo-datepicker',
        ));

    if (clickedInsideComponent || clickedInsidePopup) {
      return;
    }

    datePicker.toggle(false);
  }

  private updateErrorState() {
    const control = this.ngControl?.control;

    if (!control?.errors) {
      this.hasError.set(false);
      this.validationTrigger.update((v) => v + 1);
      return;
    }

    this.hasError.set(control.dirty || control.touched);
    this.validationTrigger.update((v) => v + 1);
  }
}
