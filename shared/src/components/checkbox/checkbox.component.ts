import { ChangeDetectionStrategy, Component, forwardRef, input, signal, TemplateRef } from '@angular/core';
import { ControlValueAccessor, FormsModule, NG_VALUE_ACCESSOR, ReactiveFormsModule } from '@angular/forms';
import { noop } from 'lodash-es';
import { CheckBoxComponent } from '@progress/kendo-angular-inputs';
import { vetIcons } from '../../shared.icons';
import { CheckboxMode, CheckboxVersion } from './checkbox.component.types';
import { IconComponent } from '../icon';
import { LabelComponent } from '@progress/kendo-angular-label';

@Component({
  selector: 'vet-checkbox',
  imports: [FormsModule, ReactiveFormsModule, IconComponent, CheckBoxComponent, LabelComponent],
  templateUrl: './checkbox.component.html',
  styleUrl: './checkbox.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => VetCheckboxComponent),
      multi: true,
    },
  ],
})
export class VetCheckboxComponent implements ControlValueAccessor {
  icon = input<keyof typeof vetIcons>();
  label = input('');
  version = input<CheckboxVersion>('thin');
  mode = input<CheckboxMode>('flat');
  iconPopover = input<TemplateRef<unknown> | null>(null);
  iconTooltip = input<string>();

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
