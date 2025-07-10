import { CanActivateFn } from '@angular/router';
import { inject } from '@angular/core';
import { toObservable } from '@angular/core/rxjs-interop';
import { combineLatest } from 'rxjs';
import { filter, map, take } from 'rxjs/operators';
import { AuthPermission } from '../auth.types';
import { UserRolesService } from '../user-roles.service';
import { AuthenticationService } from '../authentication.service';

export function hasNotPermissionGuard(permission: AuthPermission): CanActivateFn {
  return () => {
    const userRolesService = inject(UserRolesService);
    const authenticationService = inject(AuthenticationService);

    return combineLatest([
      toObservable(authenticationService.isReady),
      toObservable(userRolesService.isUserAccountsLoaded)
    ]).pipe(
      filter(([authReady, rolesLoaded]) => authReady && rolesLoaded),
      take(1),
      map(() => {
        const selectedAccount = userRolesService.selectedAccount();
        return !!selectedAccount && !userRolesService.can(permission);
      })
    );
  };
}
