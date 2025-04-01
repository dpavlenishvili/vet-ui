import { CanActivateFn } from '@angular/router';
import { inject } from '@angular/core';
import { AuthPermission } from '../auth.types';
import { filter, map, take } from 'rxjs';
import { toObservable } from '@angular/core/rxjs-interop';
import { UserRolesService } from '@vet/auth';

export function hasPermissionGuard(permission: AuthPermission): CanActivateFn {
  return () => {
    const userRolesService = inject(UserRolesService);

    return toObservable(userRolesService.selectedAccount).pipe(
      filter((selectedAccount) => selectedAccount !== null),
      take(1),
      map(() => userRolesService.can(permission)),
    );
  };
}
