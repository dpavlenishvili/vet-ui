import { rxResource } from '@angular/core/rxjs-interop';
import { map, of } from 'rxjs';
import { inject, Signal } from '@angular/core';
import { GeneralsService } from '@vet/backend';
import { isValidIdValue, mapIdValueToOption } from '@vet/shared-resources';
import { UserRolesService } from '@vet/auth';
import { withoutEmptyProperties } from '@vet/shared';
import { useConfigDictionary } from '@vet/programs-common';

export function useProgramsWithOrganisation(organisationSignal: Signal<string | null>) {
  const generalsService = inject(GeneralsService);

  return rxResource({
    defaultValue: [],
    request: organisationSignal,
    loader: ({ request: organisation }) => {
      if (!organisation) {
        return of([]);
      }
      return generalsService
        .getAllConfigs(withoutEmptyProperties({ key: 'programs', organisation }))
        .pipe(
          map(
            (data) =>
              data['programs' as keyof typeof data]?.filter(isValidIdValue).map((item) => mapIdValueToOption(item)) ??
              [],
          ),
        );
    },
  });
}

export function usePrograms(organisation?: string | null) {
  const userRolesService = inject(UserRolesService);
  const currentOrganisation = userRolesService.organisation();

  return useConfigDictionary('programs', undefined, organisation ?? currentOrganisation);
}
