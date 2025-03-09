import { InjectionToken, Type, type Provider } from '@angular/core';

type ProvideToken<T> = InjectionToken<T> | Type<T>;

interface VetFactoryProvider<T> {
  provide: ProvideToken<T>;
  useFactory: (...args: any[]) => T;
  deps?: any[];
  multi?: boolean;
}

interface VetClassProvider<T> {
  provide: ProvideToken<T>;
  useClass: Type<T>;
  multi?: boolean;
}

interface VetExistingProvider<T> {
  provide: ProvideToken<T>;
  useExisting: ProvideToken<T>;
  multi?: boolean;
}

interface VetValueProvider<T> {
  provide: ProvideToken<T>;
  useValue: T;
  multi?: boolean;
}

type VetProvider<T> =
  | VetFactoryProvider<T>
  | VetClassProvider<T>
  | VetExistingProvider<T>
  | VetValueProvider<T>;

export function vetProvide<T>(options: VetProvider<T>): Provider {
  return options;
}
