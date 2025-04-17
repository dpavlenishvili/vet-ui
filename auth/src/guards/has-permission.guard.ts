import { CanActivateFn } from '@angular/router';
import { inject } from '@angular/core';
import { toObservable } from '@angular/core/rxjs-interop';
import { map, take } from 'rxjs';
import { AuthPermission } from '../auth.types';
import { UserRolesService } from '../user-roles.service';

export function hasPermissionGuard(permission: AuthPermission): CanActivateFn {
  return () => {
    const userRolesService = inject(UserRolesService);

    return toObservable(userRolesService.selectedAccount).pipe(
      take(1),
      map((selectedAccount) => !!selectedAccount && userRolesService.can(permission)),
    );
  };
}
