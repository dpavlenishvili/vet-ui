import { CanActivateFn } from '@angular/router';

export function everyGuard(...guards: CanActivateFn[]): CanActivateFn {
  return (route, state) => {
    return guards.every((guard) => guard(route, state));
  };
}

export function oneOfGuard(...guards: CanActivateFn[]): CanActivateFn {
  return (route, state) => {
    return guards.some((guard) => guard(route, state));
  };
}
