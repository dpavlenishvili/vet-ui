import { rxResource } from '@angular/core/rxjs-interop';
import { map, of } from 'rxjs';
import { inject, Signal } from '@angular/core';
import { type ProgramShortApplicationRes, ShortProgramApplication, ShortProgramsService } from '@vet/backend';
import {
  flattenQueryParams,
  formatDateString,
  PaginatedGridResult,
  useBaseApiUrl,
  useDebounceValue,
  useFilters,
  usePage,
  withoutEmptyProperties,
} from '@vet/shared';
import { UserRolesService } from '@vet/auth';
import { HttpClient } from '@angular/common/http';
import {
  ShortTermProgramFilters,
  ShortApplicationsListenersFilters,
  ShortStatsFilters,
} from './short-term-programs.types';
import { ProgramFilters } from '@vet/programs-common';
import { isValidDictionaryItem, mapDictionaryItemToOption } from '@vet/shared-resources';

export function useShortApplicationsForOrganisation(filters: Signal<ShortApplicationsListenersFilters>) {
  const programsService = inject(ShortProgramsService);
  const userRolesService = inject(UserRolesService);

  return rxResource({
    request: () => {
      const { organisation_id, program_id, program_admission_id } = filters();
      return {
        organisation_id: userRolesService.getOrganisationId() ?? organisation_id,
        program_id: program_id,
        program_admission_id: program_admission_id,
      };
    },
    loader: ({ request }) => {
      return programsService.programsShortApplicationsForOrganisation(request);
    },
  });
}

export function useShortTermUserApplications() {
  const http = inject(HttpClient);
  const userRolesService = inject(UserRolesService);
  const baseUrl = useBaseApiUrl();

  return rxResource({
    request: () => ({
      organisation: userRolesService.getOrganisation(),
    }),
    defaultValue: [],
    loader: () => {
      return http
        .get<ProgramShortApplicationRes>(`${baseUrl}/short-programs/applications`)
        .pipe(map((response) => response.data as ShortProgramApplication[]));
    },
  });
}

export function useShortTermPrograms() {
  const programsService = inject(ShortProgramsService);
  const filters = useFilters<ProgramFilters>();
  const page = usePage();

  return rxResource({
    request: () => ({
      filters: filters(),
      page: page(),
    }),
    defaultValue: {
      data: [],
      total: 0,
      size: 0,
      skip: 0,
    },
    loader: ({ request }) =>
      programsService
        .programsShort({
          page: request.page.toString(),
          ...flattenQueryParams(request.filters, 'filters'),
        } as any)
        .pipe(
          map(
            (response) =>
              ({
                data: response.data ?? [],
                total: response.meta?.total ?? response.data?.length ?? 0,
                size: response.meta?.per_page ?? response.data?.length ?? 0,
                skip: response.meta?.from ? response.meta.from - 1 : 0,
              }) as PaginatedGridResult,
          ),
        ),
  });
}

export function useShorts(page: Signal<number>, perPage = 5) {
  const programsService = inject(ShortProgramsService);
  const filters = useFilters<ProgramFilters>();

  return rxResource({
    request: () => ({
      filters: filters(),
      page: page(),
      perPage,
    }),
    loader: ({ request }) => {
      const queryParams = {
        page: request.page.toString(),
        perPage: request.perPage.toString(),
        ...flattenQueryParams(request.filters, 'filters'),
      };

      return programsService.programsShort(queryParams as any);
    },
  });
}

export function useShortTermProgramAdmissions(educationLevelId: Signal<number | null | undefined>) {
  const programsService = inject(ShortProgramsService);
  const filters = useFilters<ShortTermProgramFilters>();
  const page = usePage();

  return rxResource({
    request: () => ({
      filters: filters(),
      page: page(),
      educationLevelId,
    }),
    defaultValue: {
      data: [],
      total: 0,
      size: 0,
      skip: 0,
    },
    loader: ({ request }) =>
      programsService
        .programsShortAdmissions({
          page: request.page.toString(),
          education_level_id: request.educationLevelId(),
          ...flattenQueryParams(request.filters, 'filters'),
        } as any)
        .pipe(
          map(
            (response) =>
              ({
                data: response.data ?? [],
                total: response.meta?.total ?? response.data?.length ?? 0,
                size: response.meta?.per_page ?? response.data?.length ?? 0,
                skip: response.meta?.from ? response.meta.from - 1 : 0,
              }) as PaginatedGridResult,
          ),
        ),
  });
}

export function useFoundProgramsCount(filters: Signal<ShortTermProgramFilters>) {
  const programsService = inject(ShortProgramsService);
  const debouncedFormValue = useDebounceValue<ShortTermProgramFilters>(
    filters,
    300,
    (a, b) => JSON.stringify(a) === JSON.stringify(b),
  );

  return rxResource<number | null, ProgramFilters>({
    request: debouncedFormValue,
    defaultValue: null,
    loader: ({ request }) => {
      if (Object.keys(request).length === 0) {
        return of(0);
      }

      return programsService
        .programsShort(flattenQueryParams(withoutEmptyProperties(request), 'filters'))
        .pipe(map((response) => response.meta?.total ?? 0));
    },
  });
}

export function useOrganisationsForApplication() {
  const shortProgramsService = inject(ShortProgramsService);

  return rxResource({
    defaultValue: [],
    request: () => ({}),
    loader: () => {
      return shortProgramsService
        .programsShortOrganisations()
        .pipe(map((response) => (response.data ?? []).filter(isValidDictionaryItem).map(mapDictionaryItemToOption)));
    },
  });
}

export function useProgramsWithOrganisation(organisationId: Signal<string | null | undefined>) {
  const shortProgramsService = inject(ShortProgramsService);

  return rxResource({
    defaultValue: [],
    request: () => ({
      organisation: organisationId(),
    }),
    loader: ({ request: organisation }) => {
      if (!organisation) {
        return of([]);
      }

      return shortProgramsService
        .programsShortByOrganisation(String(organisation.organisation))
        .pipe(map((response) => (response.data ?? []).filter(isValidDictionaryItem).map(mapDictionaryItemToOption)));
    },
  });
}

export function useAdmissionsWithPrograms(programId: Signal<string | null | undefined>) {
  const shortProgramsService = inject(ShortProgramsService);

  return rxResource({
    defaultValue: [],
    request: () => ({
      programId: programId(),
    }),
    loader: ({ request: programId }) => {
      if (!programId) {
        return of([]);
      }

      return shortProgramsService.programsShortAdmissionsByProgram(String(programId.programId)).pipe(
        map((response) =>
          (response.data ?? []).filter(isValidDictionaryItem).map((item) =>
            mapDictionaryItemToOption({
              ...item,
              name: formatDateString(item.name),
            }),
          ),
        ),
      );
    },
  });
}

export function useShortStats() {
  const programsService = inject(ShortProgramsService);

  return rxResource({
    request: () => ({}),
    defaultValue: [],
    loader: () => programsService.shortProgramsStats().pipe(map((response) => response.data ?? [])),
  });
}

export function useShortStatsOrganisation(organisation: string, filters: Signal<ShortStatsFilters>) {
  const programsService = inject(ShortProgramsService);

  return rxResource({
    request: () => ({
      organisation,
      filters: filters(),
    }),
    defaultValue: [],
    loader: ({ request }) => {
      const queryParams = {
        organisation: request.organisation,
        ...flattenQueryParams(request.filters, 'filters'),
      };

      return programsService
        .shortProgramsStatsOrganisation(request.organisation ?? '', {
          params: queryParams,
        })
        .pipe(map((response) => response.data ?? []));
    },
  });
}

export function useShortStatsWithOrganisation(organisation: string, filters: Signal<ShortStatsFilters>) {
  const programsService = inject(ShortProgramsService);

  return rxResource({
    request: () => ({
      organisation: organisation,
      filters: filters(),
    }),
    defaultValue: [],
    loader: ({ request }) =>
      programsService
        .shortProgramsStatsOrganisation(request.organisation ?? '', {
          params: Object.fromEntries(
            Object.entries(request.filters).map(([key, value]) => [key, value != null ? String(value) : '']),
          ),
        })
        .pipe(map((response) => response.data ?? [])),
  });
}

export function useShortStatsAddmission(program: string) {
  const programsService = inject(ShortProgramsService);

  return rxResource({
    request: () => ({
      program: program,
    }),
    defaultValue: [],
    loader: ({ request }) =>
      programsService.shortProgramsStatsAdmissions(request.program ?? '').pipe(map((response) => response.data ?? [])),
  });
}
