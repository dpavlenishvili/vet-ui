import { rxResource } from '@angular/core/rxjs-interop';
import { map, Observable, of } from 'rxjs';
import { inject, Signal } from '@angular/core';
import { GeneralsService } from '@vet/backend';
import {
  DictionaryType,
  isValidDictionaryItem,
  isValidIdValue,
  mapDictionaryItemToOption,
  mapIdValueToOption,
  withoutEmptyProperties,
} from '@vet/shared';
import { UserRolesService } from '@vet/auth';

export function useSeparateDictionary(
  fetch: (generals: GeneralsService) => Observable<{
    data?: Partial<DictionaryType>[] | undefined;
  }>,
) {
  const generalsService = inject(GeneralsService);

  return rxResource({
    defaultValue: [],
    loader: () =>
      fetch(generalsService).pipe(
        map((response) => {
          return response.data?.filter(isValidDictionaryItem).map((item) => mapDictionaryItemToOption(item)) ?? [];
        }),
      ),
  });
}

export function useConfigDictionary(key: string, organisation?: string | null, program_type?: string) {
  const generalsService = inject(GeneralsService);

  return rxResource({
    defaultValue: [],
    loader: () => {
      if (!organisation) {
        return of([]);
      }
      return generalsService
        .getAllConfigs(withoutEmptyProperties({ key: key, organisation, program_type }))
        .pipe(
          map(
            (data) =>
              data[key as keyof typeof data]?.filter(isValidIdValue).map((item) => mapIdValueToOption(item)) ?? [],
          ),
        );
    },
  });
}

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

export function useRegions() {
  return useSeparateDictionary((generals) => generals.getRegionsList({}));
}

export function useDistricts() {
  return useSeparateDictionary((generals) => generals.getDistrictsList({}));
}

export function useInstitutionsDictionary() {
  return useSeparateDictionary((generals) => generals.getOrganisationsList({}));
}

export function useProgramKinds() {
  return useConfigDictionary('program_types', null, 'long-term');
}

export function usePrograms(organisation?: string | null) {
  const userRolesService = inject(UserRolesService);
  const currentOrganisation = userRolesService.organisation();

  return useConfigDictionary('programs', organisation ?? currentOrganisation);
}
