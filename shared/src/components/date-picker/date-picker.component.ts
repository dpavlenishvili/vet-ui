import {
  ChangeDetectionStrategy,
  Component,
  computed,
  DestroyRef,
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
import { TextBoxComponent, TextBoxSuffixTemplateDirective } from '@progress/kendo-angular-inputs';
import { SVGIconComponent } from '@progress/kendo-angular-icons';
import { useDefaultDisplayDateFormat, useDefaultDateFormat, useKendoDatePickerFormat } from '../../shared.injectors';
import dayjs from 'dayjs';

@Component({
  selector: 'vet-date-picker',
  imports: [
    TranslocoPipe,
    FormsModule,
    KendoDatePickerComponent,
    TextBoxSuffixTemplateDirective,
    TextBoxComponent,
    SVGIconComponent,
  ],
  templateUrl: './date-picker.component.html',
  styleUrl: './date-picker.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
})
export class DatePickerComponent implements ControlValueAccessor, OnInit {
  placeholder = input('');

  ngControl = inject(NgControl, { optional: true, self: true });
  destroyRef = inject(DestroyRef);
  value = signal<Date | null>(null);
  isDisabled = signal(false);
  displayValue = signal('');
  datePicker = viewChild(KendoDatePickerComponent);
  defaultDisplayDateFormat = useDefaultDisplayDateFormat();
  defaultDateFormat = useDefaultDateFormat();
  kendoDatePickerFormat = useKendoDatePickerFormat();
  vetIcons = vetIcons;
  private onChange: (value: Date | null) => void = noop;
  private onTouched: () => void = noop;

  hasError = signal(false);

  errorMessage = computed(() => {
    const control = this.ngControl?.control;

    if (!control?.errors) {
      return '';
    }

    const errors = control.errors;
    const keys = Object.keys(errors);
    const error = keys.find((key) => errors[key]) ?? 'required';

    return `errors.${error}`;
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
      control.events
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
    this.value.set(value);
    this.onChange?.(this.setValue(value));
    this.onTouched();
  }

  private setValue(value: string | number | Date | null) {
    const resolvedValue = value ? dayjs(value, this.defaultDateFormat).toDate() : null;
    this.value.set(resolvedValue);
    this.displayValue.set(value ? dayjs(value).format(this.defaultDisplayDateFormat) : '');

    return resolvedValue;
  }

  private updateErrorState() {
    const control = this.ngControl?.control;

    if (!control?.errors) {
      this.hasError.set(false);
      return;
    }

    this.hasError.set(control.dirty || control.touched);
  }
}
