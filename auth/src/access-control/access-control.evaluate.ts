import { AccessControl, AccessControlUser } from './access-control.types';

export function evaluateAccessControl<T extends AccessControl>(accessControl: T, user: AccessControlUser): boolean {
  switch (accessControl.type) {
    case 'isAuthenticated':
      return user.isAuthenticated;

    case 'can':
      return user.permissions.includes(accessControl.permission);

    case 'is':
      return user.roles.includes(accessControl.role);

    case 'not':
      return !evaluateAccessControl(accessControl.control, user);

    case 'some':
      return accessControl.controls.some((control) => evaluateAccessControl(control, user));

    case 'every':
      return accessControl.controls.every((control) => evaluateAccessControl(control, user));

    default:
      return false;
  }
}
