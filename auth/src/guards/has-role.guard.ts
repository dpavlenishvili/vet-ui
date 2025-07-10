import { CanActivateFn } from '@angular/router';
import { computed, inject } from '@angular/core';
import { toObservable } from '@angular/core/rxjs-interop';
import { map, take, tap } from 'rxjs';
import { AuthRole } from '../auth.types';
import { UserRolesService } from '../user-roles.service';
import { filter } from 'rxjs/operators';

export function hasRoleGuard(role: AuthRole): CanActivateFn {
  return () => {
    const userRolesService = inject(UserRolesService);

    const hasRole$ = toObservable(
      computed(() => ({
        loaded: userRolesService.isUserAccountsLoaded(),
        account: userRolesService.selectedAccount(),
      })),
    );

    return hasRole$.pipe(
      tap(console.log),
      filter(({ loaded }) => loaded),
      take(1),
      map(({ account }) => {
        if (!account) return false;

        console.log('has role', role, !account.organisation);
        if (role === 'Organisation') {
          return !!account.organisation;
        }

        return !!account.roles?.includes(role);
      }),
    );
  };
}
