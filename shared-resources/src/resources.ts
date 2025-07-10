import { AdmissionService, GeneralsService } from 'backend';
import { map, Observable } from 'rxjs';
import { computed, inject, Signal } from '@angular/core';
import { rxResource } from '@angular/core/rxjs-interop';
import {
  DictionaryType,
  isValidDictionaryItem,
  isValidIdValue,
  mapDictionaryItemToOption,
  mapIdValueToOption,
  ValueLabel,
} from '@vet/shared-resources';
import { DistrictOption, ProgramType } from './types';
import { isValidDistrictDictionaryType, mapDistrictItemToOption } from './utils';
import { SelectOption, withoutEmptyProperties } from '@vet/shared';

export function useEducationLevels() {
  return useConfigDictionary('education_levels');
}

export function useProgramKinds(programType: ProgramType) {
  return useConfigDictionary('program_types', programType);
}

export function useFinancingTypes(programType: ProgramType) {
  return useConfigDictionary('financing_types', programType);
}

export function usePartners(programType: ProgramType) {
  return useConfigDictionary('partners', programType);
}

export function useRegions() {
  return useDefaultDictionary((generals) => generals.getRegionsList({}));
}


export function useDistricts() {
  return useSeparateDictionary(
    (generals) => generals.getDistrictsList({}),
    isValidDistrictDictionaryType,
    mapDistrictItemToOption,
  );
}

export function useEducationStatus() {
  const admissionService = inject(AdmissionService);

  return rxResource({
    loader: () => admissionService.educationStatus(),
  });
}

export function useUserSpecificEducationLevelOptions() {
  const educationStatus = useEducationStatus();
  const educationLevels = useEducationLevels();

  return computed(() => {
    if (educationStatus.isLoading()) {
      return [];
    }

    const _educationStatus = educationStatus.value();

    if (_educationStatus?.levelId && _educationStatus.level) {
      return [
        {
          value: _educationStatus.levelId,
          label: _educationStatus.level,
        },
      ];
    }

    if (educationLevels.isLoading()) {
      return [];
    }

    const _educationLevels = educationLevels.value();

    return _educationLevels
      .map((level) => ({
        value: level.value,
        label: level.label,
      }))
      .filter(Boolean) as Array<SelectOption<number>>;
  });
}

export function useInstitutionsDictionary() {
  return useDefaultDictionary((generals) =>
    generals.getOrganisationsList({}).pipe(
      map((items) => ({
        data:
          items.data?.map((item) => ({
            id: item.name as string,
            name: item.name as string,
          })) ?? [],
      })),
    ),
  );
}

export function useFilteredDistricts(regionId: Signal<number | null | undefined>, districts: Signal<DistrictOption[]>) {
  return computed(() => {
    const selectedRegion = regionId();
    const _districts = districts() ?? [];

    return selectedRegion ? _districts.filter((district) => district.regionId === selectedRegion) : _districts;
  });
}

export function useSeparateDictionary<T, U>(
  fetch: (generals: GeneralsService) => Observable<{
    data?: Partial<T>[] | undefined;
  }>,
  guard: (item: Partial<T>) => item is T,
  mapper: (item: T) => U,
) {
  const generalsService = inject(GeneralsService);

  return rxResource({
    defaultValue: [],
    loader: () =>
      fetch(generalsService).pipe(
        map((response) => {
          return response.data?.filter(guard).map((item) => mapper(item)) ?? [];
        }),
      ),
  });
}

export function useDefaultDictionary<T extends string | number>(
  fetch: (generals: GeneralsService) => Observable<{
    data?: Partial<DictionaryType<T>>[] | undefined;
  }>,
) {
  return useSeparateDictionary<DictionaryType<T>, ValueLabel<T>>(
    fetch,
    isValidDictionaryItem,
    mapDictionaryItemToOption,
  );
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
