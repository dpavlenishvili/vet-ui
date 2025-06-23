import { effect, inject, isSignal, signal, Signal } from '@angular/core';
import { AbstractControl } from '@angular/forms';
import { toObservable, toSignal } from '@angular/core/rxjs-interop';
import { of, startWith, switchMap } from 'rxjs';
import { LocalStoredStateService } from './services/local-stored-state.service';
import { StoredSignal } from './shared.types';
import { SessionStoredStateService } from './services/session-stored-state.service';
import { BaseStoredStateService } from './services/base-stored-state.service';
import { ActivatedRoute, Params } from '@angular/router';

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

export function useStoredValue<T>(
  provider: BaseStoredStateService,
  uniqueKey: string,
  initialValue: T,
  ttl?: number,
): StoredSignal<T> {
  const signal = provider.get<T>(uniqueKey, initialValue);

  function read() {
    return signal();
  }

  Object.assign(read, {
    set: (value: T) => provider.set(uniqueKey, value, ttl),
    update: (cb: (prev: T) => T) => provider.update(uniqueKey, cb, initialValue, ttl),
    asReadonly: () => signal,
  });

  return read as StoredSignal<T>;
}

export function useCachedValue<T>(uniqueKey: string, initialValue: T, ttl?: number): StoredSignal<T> {
  const provider = inject(LocalStoredStateService);

  return useStoredValue(provider, uniqueKey, initialValue, ttl);
}

export function useSessionValue<T>(uniqueKey: string, initialValue: T, ttl?: number): StoredSignal<T> {
  const provider = inject(SessionStoredStateService);

  return useStoredValue(provider, uniqueKey, initialValue, ttl);
}

export function useRouterParams() {
  const activatedRoute = inject(ActivatedRoute);

  return toSignal(activatedRoute.firstChild?.params ?? of({} as Params));
}

export function useDebounceValue<T>(
  value: Signal<T>,
  delayMs: number,
  equal?: (a: T, b: T) => boolean
): Signal<T> {
  const debouncedValue = signal(value(), { equal });
  let timeoutId: ReturnType<typeof setTimeout> | null = null;

  effect(() => {
    const currentValue = value();

    if (timeoutId) {
      clearTimeout(timeoutId);
    }

    timeoutId = setTimeout(() => {
      debouncedValue.set(currentValue);
    }, delayMs);
  });

  return debouncedValue.asReadonly();
}
