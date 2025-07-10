import { CanActivateFn } from '@angular/router';
import { computed, inject } from '@angular/core';
import { toObservable } from '@angular/core/rxjs-interop';
import { filter, map, take } from 'rxjs/operators';
import { AuthPermission } from '../auth.types';
import { UserRolesService } from '../user-roles.service';

export function hasPermissionGuard(permission: AuthPermission): CanActivateFn {
  return () => {
    const userRolesService = inject(UserRolesService);

    const hasRole$ = toObservable(
      computed(() => ({
        loaded: userRolesService.isUserAccountsLoaded(),
        account: userRolesService.selectedAccount(),
      })),
    );

    return hasRole$.pipe(
      filter(({ loaded }) => loaded),
      take(1),
      map(({ account }) => {
        if (!account) return false;

        return !!account.permissions?.includes(permission);
      }),
    );
  };
}
