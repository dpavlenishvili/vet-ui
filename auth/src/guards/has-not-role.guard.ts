import { CanActivateFn } from '@angular/router';
import { inject } from '@angular/core';
import { toObservable } from '@angular/core/rxjs-interop';
import { map, take } from 'rxjs';
import { AuthRole } from '../auth.types';
import { UserRolesService } from '../user-roles.service';

export function hasNotRoleGuard(role: AuthRole): CanActivateFn {
  return () => {
    const userRolesService = inject(UserRolesService);

    return toObservable(userRolesService.selectedAccount).pipe(
      take(1),
      map((selectedAccount) => !!selectedAccount && !userRolesService.hasRole(role)),
    );
  };
}
