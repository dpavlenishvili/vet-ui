import { ChangeDetectionStrategy, Component, computed, DestroyRef, inject, input, OnInit, signal } from '@angular/core';
import { ControlValueAccessor, FormsModule, NgControl } from '@angular/forms';
import { noop } from 'lodash-es';
import {
  DropDownFilterSettings,
  DropDownListComponent,
  FilterDirective,
  ItemTemplateDirective,
  NoDataTemplateDirective,
  ValueTemplateDirective,
} from '@progress/kendo-angular-dropdowns';
import { TranslocoPipe } from '@jsverse/transloco';
import { SVGIconComponent } from '@progress/kendo-angular-icons';
import { vetIcons } from '../../shared.icons';
import { SelectOption } from '../../shared.types';
import { useUniqueId } from '../../shared.injectors';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { tap } from 'rxjs';
import { SelectorVersion } from './selector.component.types';

@Component({
  selector: 'vet-selector',
  imports: [
    DropDownListComponent,
    TranslocoPipe,
    ValueTemplateDirective,
    ItemTemplateDirective,
    FormsModule,
    SVGIconComponent,
    FilterDirective,
    NoDataTemplateDirective,
  ],
  templateUrl: './selector.component.html',
  styleUrl: './selector.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
})
export class SelectorComponent<T> implements ControlValueAccessor, OnInit {
  version = input<SelectorVersion>('thin');
  label = input('');
  floatingLabel = input('');
  placeholder = input('');
  valueField = input('value');
  textField = input('label');
  disabled = input(false);
  options = input<Array<SelectOption<T>>>([]);
  error = input<string | null>(null);
  dense = input<boolean>(false);
  filterable = input<boolean>(false);

  ngControl = inject(NgControl, { optional: true, self: true });
  destroyRef = inject(DestroyRef);
  id = useUniqueId();
  value = signal<T | null>(null);
  isDisabled = signal(false);
  vetIcons = vetIcons;
  private onChange: (value: T) => void = noop;
  private onTouched: () => void = noop;

  defaultItem = computed(() => ({
    label: this.placeholder(),
    value: null,
  }));

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

  writeValue(value: T): void {
    this.value.set(value);
  }

  handleChange(value: T) {
    this.value.set(value);
    this.onChange?.(value);
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

  public filterSettings: DropDownFilterSettings = {
    caseSensitive: false,
    operator: 'contains',
  };

  public changeFilterOperator(operator: 'startsWith' | 'contains'): void {
    this.filterSettings.operator = operator;
  }
}
