import { ChangeDetectionStrategy, Component, computed, DestroyRef, inject, input, OnInit, signal } from '@angular/core';
import { ControlValueAccessor, FormsModule, NgControl } from '@angular/forms';
import { noop } from 'lodash-es';
import {
  DropDownListComponent,
  ItemTemplateDirective,
  ValueTemplateDirective,
} from '@progress/kendo-angular-dropdowns';
import { TranslocoPipe } from '@jsverse/transloco';
import { SVGIconComponent } from '@progress/kendo-angular-icons';
import { vetIcons } from '../../shared.icons';
import { SelectOption } from '../../shared.types';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { tap } from 'rxjs';

@Component({
  selector: 'vet-selector',
  imports: [
    DropDownListComponent,
    TranslocoPipe,
    ValueTemplateDirective,
    ItemTemplateDirective,
    FormsModule,
    SVGIconComponent,
  ],
  templateUrl: './selector.component.html',
  styleUrl: './selector.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
})
export class SelectorComponent<T> implements ControlValueAccessor, OnInit {
  placeholder = input('');
  options = input<Array<SelectOption<T>>>([]);

  ngControl = inject(NgControl, { optional: true, self: true });
  destroyRef = inject(DestroyRef);
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
      return;
    }

    this.hasError.set(control.dirty || control.touched);
  }
}
