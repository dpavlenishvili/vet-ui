import { AdmissionService, GeneralsService } from 'backend';
import { catchError, map, Observable, of } from 'rxjs';
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
import { DistrictOption, OrganisationOptions, ProgramType } from './types';
import {
  isValidDistrictDictionaryType,
  isValidOrganisationDictionaryType,
  isValidPartnersDictionaryType,
  mapDistrictItemToOption,
  mapOrganistaiontemToOption,
  mapPartnersItemToOption,
} from './utils';
import { SelectOption, withoutEmptyProperties } from '@vet/shared/utils';
import { useAlert } from '@vet/shared/dialogs';

export function useEducationLevels() {
  return useConfigDictionary('education_levels');
}

export function useProgramKinds(programType: ProgramType) {
  return useConfigDictionary('program_types', programType);
}

export function useFinancingTypes(programType: ProgramType) {
  return useConfigDictionary('financing_types', programType);
}

export function useFunding() {
  return [
    {
      value: 'full',
      label: 'shorts.full_funding',
    },
    {
      value: 'no',
      label: 'shorts.no_funding',
    },
    {
      value: 'partial',
      label: 'shorts.partial_funding',
    },
  ];
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

export function useOrganisations() {
  return useSeparateDictionary(
    (generals) => generals.getOrganisationsList({}),
    isValidOrganisationDictionaryType,
    mapOrganistaiontemToOption,
  );
}

export function useGeneralPartners() {
  return useSeparateDictionary(
    (generals) => generals.getPartnersList({}),
    isValidPartnersDictionaryType,
    mapPartnersItemToOption,
  );
}

export function useEducationStatus() {
  const admissionService = inject(AdmissionService);
  const alert = useAlert();

  return rxResource({
    loader: () =>
      admissionService.educationStatus().pipe(
        catchError(() => {
          alert.error('shared.occured_technical_error');
          return of([]);
        }),
      ),
  });
}

export function useUserSpecificEducationLevelOptions() {
  const educationStatus = useEducationStatus();

  return computed(() => {
    if (educationStatus.isLoading()) {
      return [];
    }

    const _educationStatus = educationStatus.value();

    return _educationStatus
      ?.map((level) => ({
        value: level.levelId,
        label: level.level,
      }))
      .filter(Boolean) as Array<SelectOption<number>>;
  });
}

export function useInstitutionsDictionary(withId?: boolean) {
  return useDefaultDictionary((generals) =>
    generals.getOrganisationsList({}).pipe(
      map((items) => ({
        data:
          items.data?.map((item) => ({
            id: withId ? item.id as number : item.name as string,
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

export function useFilteredOrganisations(
  regionId: Signal<number | null | undefined>,
  districtId: Signal<number | null | undefined>,
  organisations: Signal<OrganisationOptions[]>,
) {
  return computed(() => {
    const selectedRegion = regionId();
    const selectedDistrict = districtId();
    const _organisations = organisations() ?? [];

    if (selectedDistrict) {
      return _organisations.filter((organisation) => organisation.districtId === selectedDistrict);
    }

    if (selectedRegion) {
      return _organisations.filter((organisation) => organisation.regionId === selectedRegion);
    }

    return _organisations;
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

export function useConfigDictionary(key: string, programType?: 'short-term' | 'long-term', organisation?: string) {
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
