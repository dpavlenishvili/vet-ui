import { isSignal, Signal } from '@angular/core';
import { AbstractControl } from '@angular/forms';
import { toObservable, toSignal } from '@angular/core/rxjs-interop';
import { of, startWith, switchMap } from 'rxjs';

export function useControlValue<T extends AbstractControl>(
  control: T | Signal<T>,
  selectControl: (control: T) => AbstractControl = (control) => control,
) {
  return toSignal(
    (isSignal(control) ? toObservable(control) : of(control)).pipe(
      switchMap((control) => {
        const selectedControl = selectControl(control);

        return selectedControl.valueChanges.pipe(startWith(selectedControl.value));
      }),
    ),
  );
}
