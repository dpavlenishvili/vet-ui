import { inject, resource, ResourceRef, Signal } from '@angular/core';
import { AdmissionPrograms, AdmissionService } from '@vet/backend';
import { firstValueFrom, map } from 'rxjs';

export function admissionProgramsResource(
  admissionId: Signal<string | null | undefined>,
): ResourceRef<AdmissionPrograms[] | undefined> {
  const admissionService = inject(AdmissionService);
  return resource({
    request: () => ({ admissionId: admissionId() }),
    loader: ({ request: { admissionId } }) => {
      if (!admissionId) {
        return Promise.resolve([]);
      }

      return firstValueFrom(
        admissionService
          .admissionList({
            role: 'Default User',
            number: admissionId,
          })
          .pipe(map((res) => res.data?.[0]?.programs ?? [])),
      );
    },
  });
}
