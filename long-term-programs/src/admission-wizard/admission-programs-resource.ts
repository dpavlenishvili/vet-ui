import { inject, resource, ResourceRef, Signal } from '@angular/core';
import { AdmissionPrograms, AdmissionService } from '@vet/backend';
import { firstValueFrom, map } from 'rxjs';
import { UserRolesService } from '@vet/auth';

export function admissionProgramsResource(
  admissionId: Signal<string | null | undefined>,
): ResourceRef<AdmissionPrograms[] | undefined> {
  const admissionService = inject(AdmissionService);
  const userRolesService = inject(UserRolesService);
  return resource({
    request: () => ({ admissionId: admissionId() }),
    loader: ({ request: { admissionId } }) => {
      if (!admissionId) {
        return Promise.resolve([]);
      }

      return firstValueFrom(
        admissionService
          .admissionList({
            role: userRolesService.selectedAccount()?.organisation ? '' : userRolesService.selectedRole(),
            organisation: userRolesService.selectedAccount()?.organisation || '',
            number: admissionId,
          })
          .pipe(map((res) => res.data?.[0]?.programs ?? [])),
      );
    },
  });
}
