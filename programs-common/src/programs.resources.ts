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
} from '@vet/shared-resources';
import { withoutEmptyProperties } from '@vet/shared';

export function useSeparateDictionary(fetch: (generals: GeneralsService) => Observable<{
  data?: Partial<DictionaryType>[] | undefined;
}>) {
  const generalsService = inject(GeneralsService);

  return rxResource({
    defaultValue: [],
    loader: () =>
      fetch(generalsService).pipe(
        map((response) => {
          return response.data
            ?.filter(isValidDictionaryItem)
            .map((item) => mapDictionaryItemToOption(item)) ?? [];
        }),
      ),
  });
}

export function useConfigDictionary(
  key: string,
  programType?: 'short-term' | 'long-term',
  organisation?: string | null,
) {
  const generalsService = inject(GeneralsService);

  return rxResource({
    defaultValue: [],
    loader: () =>
      generalsService
        .getAllConfigs(withoutEmptyProperties({
          key: key,
          program_type: programType,
          organisation: organisation ?? undefined
        }))
        .pipe(
          map(
            (data) =>
              data[key as keyof typeof data]?.filter(isValidIdValue).map((item) => mapIdValueToOption(item)) ?? [],
          ),
        ),
  });
}

export function useFinasncingTypes() {
  return useConfigDictionary('financing_types', 'short-term');
}

export function usePartners() {
  return useConfigDictionary('partners', 'short-term');
}

export function useProgramTypes() {
  return useConfigDictionary('program_types', 'long-term')
}

export function useRegions() {
  return useSeparateDictionary(generals => generals.getRegionsList({}));
}

export function useDistricts() {
  return useSeparateDictionary(generals => generals.getDistrictsList({}));
}

export function useInstitutionsDictionary() {
  return useSeparateDictionary(generals => generals.getOrganisationsList({}));
}
