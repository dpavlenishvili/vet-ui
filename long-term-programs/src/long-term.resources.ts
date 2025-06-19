import { rxResource } from '@angular/core/rxjs-interop';
import { map, Observable } from 'rxjs';
import { inject } from '@angular/core';
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
          if (!response.data || !Array.isArray(response.data)) {
            return [];
          }
          return response.data
            .filter(isValidDictionaryItem)
            .map((item) => mapDictionaryItemToOption(item));
        })
      ),
  });
}

export function useConfigDictionary(
  key: string,
  organisation?: string,
  program_type?: string
) {
  const generalsService = inject(GeneralsService);

  return rxResource({
    defaultValue: [],
    loader: () => {
      const params = withoutEmptyProperties({
        key,
        organisation,
        program_type
      });

      return generalsService
        .getAllConfigs(params)
        .pipe(
          map((data) => {
            const configData = data[key as keyof typeof data];
            if (!Array.isArray(configData)) {
              return [];
            }
            return configData
              .filter(isValidIdValue)
              .map((item) => mapIdValueToOption(item));
          })
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
  return useConfigDictionary('program_types', undefined, 'long-term');
}

export function usePrograms() {
  const userRolesService = inject(UserRolesService);
  const organisation = userRolesService.getOrganisation();

  return useConfigDictionary('programs', organisation);
}
