import { CanActivateFn } from '@angular/router';
import { computed, inject } from '@angular/core';
import { toObservable } from '@angular/core/rxjs-interop';
import { filter, map, take } from 'rxjs';
import { AuthRole } from '../auth.types';
import { UserRolesService } from '../user-roles.service';

export function hasNotRoleGuard(role: AuthRole): CanActivateFn {
  return () => {
    const userRolesService = inject(UserRolesService);

    const state$ = toObservable(
      computed(() => ({
        loaded: userRolesService.isUserAccountsLoaded(),
        account: userRolesService.selectedAccount(),
      })),
    );

    return state$.pipe(
      filter(({ loaded }) => loaded),
      take(1),
      map(({ account }) => !!account && !userRolesService.hasRole(role)),
    );
  };
}
