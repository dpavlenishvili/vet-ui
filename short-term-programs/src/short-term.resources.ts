import { rxResource } from '@angular/core/rxjs-interop';
import { map, of } from 'rxjs';
import { inject, Signal } from '@angular/core';
import { type ProgramShortApplicationRes, ProgramsService, ShortProgramApplication } from '@vet/backend';
import {
  flattenQueryParams,
  PaginatedGridResult,
  useBaseApiUrl, useDebounceValue,
  useFilters,
  usePage,
  withoutEmptyProperties
} from '@vet/shared';
import { UserRolesService } from '@vet/auth';
import { HttpClient } from '@angular/common/http';
import { ShortTermProgramFilters, ShortTermRegisteredListenersFilters } from './short-term-programs.types';
import { ProgramFilters } from '@vet/programs-common';

export function useShortTermRegisteredListeners(filters: Signal<ShortTermRegisteredListenersFilters>) {
  const http = inject(HttpClient);
  const userRolesService = inject(UserRolesService);
  const baseUrl = useBaseApiUrl();

  return rxResource({
    request: () => ({
      organisation: userRolesService.getOrganisation(),
      filters: filters(),
    }),
    defaultValue: [],
    loader: ({ request: { organisation, filters } }) => {
      return http
        .get<ProgramShortApplicationRes>(`${baseUrl}/programs/short/applications`, {
          params: flattenQueryParams(filters),
        })
        .pipe(map((response) => response.data as ShortProgramApplication[]));
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
        .get<ProgramShortApplicationRes>(`${baseUrl}/programs/short/applications`)
        .pipe(map((response) => response.data as ShortProgramApplication[]));
    },
  });
}

export function useShortTermPrograms() {
  const programsService = inject(ProgramsService);
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

export function useShortTermProgramAdmissions() {
  const programsService = inject(ProgramsService);
  const filters = useFilters<ShortTermProgramFilters>();
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
        .programsShortAdmissions({
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

export function useFoundProgramsCount(filters: Signal<ShortTermProgramFilters>) {
  const programsService = inject(ProgramsService);
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
