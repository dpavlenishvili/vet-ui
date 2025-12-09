import {
  ChangeDetectionStrategy,
  Component,
  computed,
  DestroyRef,
  ElementRef,
  inject,
  input,
  OnInit,
  output,
  signal,
  TemplateRef,
  viewChild,
} from '@angular/core';
import { ControlValueAccessor, FormsModule, NgControl } from '@angular/forms';
import { noop } from 'lodash-es';
import { TranslocoPipe } from '@jsverse/transloco';
import { vetIcons } from '../../shared.icons';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { tap } from 'rxjs';
import { InputType, InputVersion } from './input.component.types';
import {
  FormFieldComponent,
  TextBoxComponent,
  TextBoxPrefixTemplateDirective,
  TextBoxSuffixTemplateDirective,
} from '@progress/kendo-angular-inputs';
import { FloatingLabelComponent } from '@progress/kendo-angular-label';
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
    FloatingLabelComponent,
    FormFieldComponent,
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
  label = input('');
  floatingLabel = input('');
  placeholder = input('');
  readonly = input<boolean>(false);
  clearButton = input<boolean>(false);
  isInvalid = input<boolean>(false);
  error = input<string | null>(null);
  dense = input<boolean>(false);
  maxlength = input<number>(Infinity);
  leadingIcon = input<keyof typeof vetIcons>();
  leadingIconPopover = input<TemplateRef<unknown> | null>(null);
  leadingIconTooltip = input<string>();
  trailingIcon = input<keyof typeof vetIcons>();
  trailingIconPopover = input<TemplateRef<unknown> | null>(null);
  trailingIconTooltip = input<string>();

  // eslint-disable-next-line @angular-eslint/no-output-native
  focus = output();
  // eslint-disable-next-line @angular-eslint/no-output-native
  blur = output();

  ngControl = inject(NgControl, { optional: true, self: true });
  destroyRef = inject(DestroyRef);
  elementRef = inject(ElementRef);
  textBox = viewChild(TextBoxComponent);
  value = signal<string | null>(null);
  isDisabled = signal(false);
  vetIcons = vetIcons;
  id = useUniqueId();
  private onChange: (value: string) => void = noop;
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
      ? keys.find((key) => key !== 'required' && errors[key]) ?? keys.find((key) => errors[key])
      : keys.find((key) => errors[key]);

    return `errors.${error ?? 'required'}`;
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

  writeValue(value: string | null): void {
    this.value.set(value ?? '');
  }

  handleChange(value: string | null) {
    const normalizedValue = value ?? '';
    this.value.set(normalizedValue);
    this.onChange?.(normalizedValue);
    this.onTouched();
  }

  private updateErrorState() {
    const control = this.ngControl?.control;

    if (!control?.errors) {
      this.hasError.set(false);
      this.validationTrigger.update(v => v + 1);
      return;
    }

    this.hasError.set(control.dirty || control.touched);
    this.validationTrigger.update(v => v + 1);
  }
}
