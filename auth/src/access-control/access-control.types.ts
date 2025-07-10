import { AuthPermission, AuthRole } from '../auth.types';

export interface IsAuthenticatedControl {
  type: 'isAuthenticated';
}

export interface CanControl<T extends AuthPermission = AuthPermission> {
  type: 'can';
  permission: T;
}

export interface IsControl<T extends AuthRole = AuthRole> {
  type: 'is';
  role: T;
}

export interface NotControl<T extends AccessControl = AccessControl> {
  type: 'not';
  control: T;
}

export interface SomeControl<T extends [...AccessControl[]] = AccessControl[]> {
  type: 'some';
  controls: T;
}

export interface EveryControl<T extends [...AccessControl[]] = AccessControl[]> {
  type: 'every';
  controls: T;
}

export type CanSomeControl<T extends [...AuthPermission[]] = AuthPermission[]> = SomeControl<[] & {
  [K in keyof T]: CanControl<T[K]>;
}>;

export type CanEveryControl<T extends [...AuthPermission[]] = AuthPermission[]> = EveryControl<[] & {
  [K in keyof T]: CanControl<T[K]>;
}>;

export type IsOneOfControl<T extends [...AuthRole[]] = AuthRole[]> = SomeControl<[] & {
  [K in keyof T]: IsControl<T[K]>;
}>;

export type AccessControl =
  | IsAuthenticatedControl
  | CanControl
  | CanSomeControl
  | CanEveryControl
  | IsControl
  | IsOneOfControl
  | NotControl
  | SomeControl
  | EveryControl;

export interface AccessControlUser {
  isAuthenticated: boolean;
  roles: AuthRole[];
  permissions: AuthPermission[];
}
