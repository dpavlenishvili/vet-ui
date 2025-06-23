import { rxResource } from '@angular/core/rxjs-interop';
import { map, Observable } from 'rxjs';
import { inject } from '@angular/core';
import { GeneralsService } from '@vet/backend';
import {
  DictionaryType,
  isValidDictionaryItem,
  isValidIdValue,
  mapDictionaryItemToOption,
  mapIdValueToOption, withoutEmptyProperties
} from '@vet/shared';

export function useSeparateDictionary(fetch: (generals: GeneralsService) => Observable<{
  data?: Partial<DictionaryType<number | string>>[] | undefined;
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
  organisation?: string,
) {
  const generalsService = inject(GeneralsService);

  return rxResource({
    defaultValue: [],
    loader: () =>
      generalsService
        .getAllConfigs(withoutEmptyProperties({ key: key, program_type: programType, organisation }))
        .pipe(
          map(
            (data) =>
              data[key as keyof typeof data]?.filter(isValidIdValue).map((item) => mapIdValueToOption(item)) ?? [],
          ),
        ),
  });
}

export function useEducationLevels() {
  return useConfigDictionary('education_levels', 'short-term');
}

export function useProgramKinds() {
  return useConfigDictionary('program_types', 'short-term');
}

export function useFinancingTypes() {
  return useConfigDictionary('financing_types', 'short-term');
}

export function usePartners() {
  return useConfigDictionary('partners', 'short-term');
}

export function useRegions() {
  return useSeparateDictionary(generals => generals.getRegionsList({}));
}

export function useDistricts() {
  return useSeparateDictionary(generals => generals.getDistrictsList({}));
}

export function useInstitutionsDictionary() {
  return useSeparateDictionary(generals => generals.getOrganisationsList({}).pipe(
    map(items => ({
      data: items.data?.map(item => ({
        id: item.name,
        name: item.name,
      }))
    }))
  ));
}
