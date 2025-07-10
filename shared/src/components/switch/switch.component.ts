import { ChangeDetectionStrategy, Component, forwardRef, input, signal, TemplateRef } from '@angular/core';
import { ControlValueAccessor, FormsModule, NG_VALUE_ACCESSOR, ReactiveFormsModule } from '@angular/forms';
import { noop } from 'lodash-es';
import { SwitchComponent } from '@progress/kendo-angular-inputs';
import { TranslocoPipe } from '@jsverse/transloco';
import { vetIcons } from '../../shared.icons';
import { SwitchMode, SwitchVersion } from './switch.component.types';
import { IconComponent } from '../icon';

@Component({
  selector: 'vet-switch',
  imports: [FormsModule, ReactiveFormsModule, SwitchComponent, TranslocoPipe, IconComponent],
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
  icon = input<keyof typeof vetIcons>();
  label = input('');
  version = input<SwitchVersion>('thin');
  mode = input<SwitchMode>('flat');
  iconPopover = input<TemplateRef<unknown> | null>(null);
  iconTooltip = input<string>();

  value = signal(false);
  isDisabled = signal(false);
  vetIcons = vetIcons;

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
