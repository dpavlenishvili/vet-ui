import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';
import { effect, Signal } from '@angular/core';

export function withSignalValidation<T extends AbstractControl>(
  control: T,
  signalDeps: Array<Signal<unknown>>
): T {
  effect(() => {
    signalDeps.forEach(dep => dep());
    control.updateValueAndValidity({ emitEvent: false });
  });

  return control;
}

export function conditionalValidator({ when, then, else: _else }: {
  when: () => boolean | null | undefined;
  then: () => ValidatorFn | null;
  else?: () => ValidatorFn | null;
}) {
  return (control: AbstractControl): ValidationErrors | null => {
    if (when()) {
      const thenValidator = then();

      return thenValidator ? thenValidator(control) : null;
    }

    const elseValidator = _else ? _else() : null;

    return elseValidator ? elseValidator(control) : null;
  };
}
