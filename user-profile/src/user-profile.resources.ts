import { rxResource } from '@angular/core/rxjs-interop';
import { map, Observable } from 'rxjs';
import { inject } from '@angular/core';
import { GeneralsService } from '@vet/backend';
import {
  DictionaryType,
  isValidDictionaryItem,
  mapDictionaryItemToOption,
} from '@vet/shared-resources';

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

export function useRegionsOptions() {
  return useSeparateDictionary((generals) => generals.getRegionsList({}));
}

export function useDistrictsOptions() {
  return useSeparateDictionary((generals) => generals.getDistrictsList({}));
}
