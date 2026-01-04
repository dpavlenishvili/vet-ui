import { computed, effect, inject, isSignal, signal, Signal } from '@angular/core';
import { AbstractControl, FormControlState } from '@angular/forms';
import { toObservable, toSignal } from '@angular/core/rxjs-interop';
import { combineLatest, map, of, startWith, switchMap } from 'rxjs';

import { LocalStoredStateService } from './services/local-stored-state.service';
import { ExtractControlValue, StoredSignal, ToggleSignal } from './shared.types';
import { SessionStoredStateService } from './services/session-stored-state.service';
import { BaseStoredStateService } from './services/base-stored-state.service';
import { ActivatedRoute, Params } from '@angular/router';
import { mapControlToReactiveControl, ReactiveControl } from './shared.utils';

export function useReactiveControl<T>(
  control: AbstractControl<T> | Signal<AbstractControl<T> | null | undefined> | null | undefined,
): Signal<ReactiveControl<AbstractControl<T>>>;
export function useReactiveControl<T extends AbstractControl, U extends AbstractControl>(
  control: T | Signal<T | null | undefined> | null | undefined,
  selectControl: (control: T) => U,
): Signal<ReactiveControl<U>>;
export function useReactiveControl<T extends AbstractControl, U extends AbstractControl>(
  control: T | Signal<T | null | undefined> | null | undefined,
  selectControl: (control: T) => U = (control) => control as unknown as U,
): Signal<ReactiveControl<U>> {
  return toSignal(
    (isSignal(control) ? toObservable(control) : of(control)).pipe(
      switchMap((control) => {
        if (!control) {
          return of(undefined);
        }

        const selectedControl = selectControl(control);

        return combineLatest([
          selectedControl.events,
          selectedControl.valueChanges,
          selectedControl.statusChanges,
        ]).pipe(
          map(() => mapControlToReactiveControl(selectedControl)),
          startWith(mapControlToReactiveControl(selectedControl)),
        );
      }),
    ),
  ) as Signal<ReactiveControl<U>>;
}

export function useControlValue<T>(
  control: AbstractControl<T> | Signal<AbstractControl<T> | null | undefined> | null | undefined,
): Signal<T extends FormControlState<infer U> ? U : T>;
export function useControlValue<T extends AbstractControl, U extends AbstractControl>(
  control: T | Signal<T | null | undefined> | null | undefined,
  selectControl: (control: T) => U,
): Signal<ExtractControlValue<U>>;
export function useControlValue<T extends AbstractControl, U extends AbstractControl>(
  control: T | Signal<T | null | undefined> | null | undefined,
  selectControl: (control: T) => U = (control) => control as unknown as U,
): Signal<ExtractControlValue<U>> {
  const $control = useReactiveControl(control, selectControl);

  return computed(() => $control().value);
}

export function useMappedControlValue<T, U>(
  control: AbstractControl<T> | Signal<AbstractControl<T>>,
  mapValue: (value: T extends FormControlState<infer V> ? V : T) => U,
) {
  const value = useControlValue(control, (control) => control);

  return computed(() => mapValue(value() as T extends FormControlState<infer V> ? V : T));
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

export function useDebounceValue<T>(value: Signal<T>, delayMs: number, equal?: (a: T, b: T) => boolean): Signal<T> {
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

export function useToggleState(initialState: boolean): ToggleSignal {
  const state = signal(initialState);

  Object.assign(state, {
    toggle: () => state.update((value) => !value),
  });

  return state as unknown as ToggleSignal;
}
