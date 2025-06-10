import { ChangeDetectionStrategy, Component, forwardRef, input, signal } from '@angular/core';
import { ControlValueAccessor, FormsModule, NG_VALUE_ACCESSOR, ReactiveFormsModule } from '@angular/forms';
import { noop } from 'lodash-es';
import { SwitchComponent } from '@progress/kendo-angular-inputs';
import { TranslocoPipe } from '@jsverse/transloco';

@Component({
  selector: 'vet-switch',
  imports: [FormsModule, ReactiveFormsModule, SwitchComponent, TranslocoPipe],
  templateUrl: './switch.component.html',
  styleUrl: './switch.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => VetSwitchComponent),
      multi: true,
    },
  ],
})
export class VetSwitchComponent implements ControlValueAccessor {
  label = input('');

  value = signal(false);
  isDisabled = signal(false);
  private onChange: (value: boolean) => void = noop;
  private onTouched: () => void = noop;

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.isDisabled.set(isDisabled);
  }

  writeValue(value: boolean): void {
    this.value.set(value);
  }

  handleChange(value: boolean) {
    this.value.set(value);
    this.onChange?.(value);
  }
}
