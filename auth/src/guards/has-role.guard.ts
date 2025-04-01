import { CanActivateFn } from '@angular/router';
import { inject } from '@angular/core';
import { filter, map, take } from 'rxjs';
import { AuthRole } from '../auth.types';
import { toObservable } from '@angular/core/rxjs-interop';
import { UserRolesService } from '@vet/auth';

export function hasRoleGuard(role: AuthRole): CanActivateFn {
  return () => {
    const userRolesService = inject(UserRolesService);

    return toObservable(userRolesService.selectedAccount).pipe(
      filter((selectedAccount) => selectedAccount !== null),
      take(1),
      map(() => userRolesService.hasRole(role)),
    );
  };
}
