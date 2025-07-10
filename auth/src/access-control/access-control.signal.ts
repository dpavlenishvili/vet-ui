import { computed, inject } from '@angular/core';
import { AccessControl, UserRolesService } from '@vet/auth';

export function useAccessControl() {
  const userRolesService = inject(UserRolesService);

  return <T extends AccessControl>(control: T | null | undefined) => {
    return computed(() => userRolesService.hasAccess(control));
  };
}
