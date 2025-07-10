import { computed, inject } from '@angular/core';
import { AuthenticationService } from './authentication.service';
import { UserRolesService } from './user-roles.service';
import { AuthPermission, AuthRole } from './auth.types';

export function useUser() {
  const authService = inject(AuthenticationService);

  return authService.user;
}

export function useIsUserLoaded() {
  const authService = inject(AuthenticationService);

  return authService.isReady;
}

export function useHasRole() {
  const userRolesService = inject(UserRolesService);

  return (role: AuthRole) => {
    return computed(() => userRolesService.hasRole(role));
  };
}

export function useCan() {
  const userRolesService = inject(UserRolesService);

  return (permission: AuthPermission) => {
    return computed(() => userRolesService.can(permission));
  };
}
