import { rxResource } from '@angular/core/rxjs-interop';
import { map } from 'rxjs';
import { inject } from '@angular/core';
import { GeneralsService } from '@vet/backend';
import { isValidIdValue, mapIdValueToOption } from '@vet/shared';

export function useDictionary(key: string) {
  const generalsService = inject(GeneralsService);

  return rxResource({
    defaultValue: [],
    loader: () => generalsService
      .getAllConfigs({ key: key })
      .pipe(
        map((data) => data[key as keyof typeof data]
          ?.filter(isValidIdValue)
          .map(item => mapIdValueToOption(item)) ?? []
        )
      ),
  });
}

export function useEducationLevels() {
  return useDictionary('education_levels');
}
