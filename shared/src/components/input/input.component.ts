import {
  ChangeDetectionStrategy,
  Component,
  computed,
  DestroyRef,
  inject,
  input,
  OnInit,
  signal,
  TemplateRef,
} from '@angular/core';
import { ControlValueAccessor, FormsModule, NgControl } from '@angular/forms';
import { noop } from 'lodash-es';
import { TranslocoPipe } from '@jsverse/transloco';
import { vetIcons } from '../../shared.icons';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { tap } from 'rxjs';
import { InputType, InputVersion } from './input.component.types';
import {
  TextBoxComponent,
  TextBoxPrefixTemplateDirective,
  TextBoxSuffixTemplateDirective,
} from '@progress/kendo-angular-inputs';
import { IconComponent } from '../icon';
import { useUniqueId } from '../../shared.injectors';

@Component({
  selector: 'vet-input',
  imports: [
    TranslocoPipe,
    FormsModule,
    TextBoxSuffixTemplateDirective,
    TextBoxComponent,
    TextBoxPrefixTemplateDirective,
    IconComponent,
  ],
  templateUrl: './input.component.html',
  styleUrl: './input.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
})
export class InputComponent implements ControlValueAccessor, OnInit {
  type = input<InputType>('text');
  version = input<InputVersion>('thin');
  topLabelFromThe90s = input('');
  placeholder = input('');
  leadingIcon = input<keyof typeof vetIcons>();
  leadingIconPopover = input<TemplateRef<unknown> | null>(null);
  leadingIconTooltip = input<string>();
  trailingIcon = input<keyof typeof vetIcons>();
  trailingIconPopover = input<TemplateRef<unknown> | null>(null);
  trailingIconTooltip = input<string>();

  ngControl = inject(NgControl, { optional: true, self: true });
  destroyRef = inject(DestroyRef);
  value = signal<string | null>(null);
  isDisabled = signal(false);
  vetIcons = vetIcons;
  id = useUniqueId();
  private onChange: (value: string) => void = noop;
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

  writeValue(value: string): void {
    this.value.set(value);
  }

  handleChange(value: string) {
    this.value.set(value);
    this.onChange?.(value);
    this.onTouched();
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
