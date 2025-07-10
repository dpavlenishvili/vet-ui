import { AuthPermission, AuthRole } from '../auth.types';
import {
  AccessControl,
  CanControl, CanEveryControl, CanSomeControl,
  EveryControl, IsAuthenticatedControl,
  IsControl, IsOneOfControl,
  NotControl,
  SomeControl
} from './access-control.types';

/**
 * Passes when user is authenticated
 */
export function isAuthenticated(): IsAuthenticatedControl {
  return {
    type: 'isAuthenticated',
  };
}

/**
 * Passes when user is NOT authenticated, i.e. guest
 */
export function isGuest(): NotControl<IsAuthenticatedControl> {
  return not(isAuthenticated());
}

/**
 * Passes when user HAS the provided PERMISSION
 *
 * @param permission
 */
export function can<T extends AuthPermission>(permission: T): CanControl<T> {
  return {
    type: 'can',
    permission,
  };
}

/**
 * Passes when user DOES NOT have the provided PERMISSION
 *
 * @param permission
 */
export function cannot(permission: AuthPermission): NotControl<CanControl> {
  return not(can(permission));
}

/**
 * Passes when user has, at least, ONE OF the provided permissions
 *
 * @param permissions
 */
export function canSome<T extends AuthPermission[]>(...permissions: [...T]): CanSomeControl<[...T]> {
  return some(...permissions.map(can)) as CanSomeControl<[...T]>;
}

/**
 * Passes when user ALL the provided permissions
 *
 * @param permissions
 */
export function canEvery<T extends AuthPermission[]>(...permissions: [...T]): CanEveryControl<[...T]> {
  return every(...permissions.map(can)) as CanEveryControl<[...T]>;
}

/**
 * Passes when user HAS the provided ROLE
 *
 * @param role
 */
export function is<T extends AuthRole>(role: T): IsControl<T> {
  return {
    type: 'is',
    role,
  };
}

/**
 * Passes when user has, at least, ONE OF the provided roles
 *
 * @param roles
 */
export function isOneOf<T extends AuthRole[]>(...roles: [...T]): IsOneOfControl<[...T]> {
  return some(...roles.map(is)) as IsOneOfControl<[...T]>;
}

/**
 * Passes when user DOES NOT have the provided ROLE
 *
 * @param role
 */
export function isNot<T extends AuthRole>(role: T): NotControl<IsControl<T>> {
  return not(is(role));
}

/**
 * Passes when the provided control not passes, I.E. negates whatever is provided.
 *
 * @param control
 */
export function not<T extends AccessControl>(control: T): NotControl<T> {
  return {
    type: 'not',
    control,
  };
}

/**
 * Passes only when, at least, ONE OF the provided controls is valid
 *
 * @param controls
 */
export function some<T extends AccessControl[]>(...controls: [...T]): SomeControl<T> {
  return {
    type: 'some',
    controls,
  };
}

/**
 * Passes only when ALL the provided controls is valid
 *
 * @param controls
 */
export function every<T extends AccessControl[]>(...controls: [...T]): EveryControl<T> {
  return {
    type: 'every',
    controls,
  };
}

/**
 * Passes only when NONE of the provided controls is valid
 *
 * @param controls
 */
export function none<T extends AccessControl[]>(...controls: [...T]): NotControl<EveryControl<T>> {
  return not(every(...controls)) as NotControl<EveryControl<T>>;
}
