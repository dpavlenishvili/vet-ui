import { computed, inject } from '@angular/core';
import { AccessControl, UserRolesService } from '@vet/auth';
import { CanActivateFn } from '@angular/router';
import { toObservable } from '@angular/core/rxjs-interop';
import { filter, map, take } from 'rxjs/operators';

export function AccessControlGuard<T extends AccessControl>(control: T): CanActivateFn {
  return () => {
    const userRolesService = inject(UserRolesService);

    const hasRole$ = toObservable(
      computed(() => ({
        loaded: userRolesService.isUserAccountsLoaded(),
        account: userRolesService.selectedAccount(),
        hasAccess: userRolesService.hasAccess(control),
      })),
    );

    return hasRole$.pipe(
      filter(({ loaded }) => loaded),
      take(1),
      map(({ account, hasAccess }) => {
        if (!account) return false;

        return hasAccess;
      }),
    );
  };
}
