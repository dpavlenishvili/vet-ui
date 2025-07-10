import { rxResource } from '@angular/core/rxjs-interop';
import { map, of } from 'rxjs';
import {
  flattenQueryParams,
  PaginatedGridResult,
  useDebounceValue,
  useFilters,
  usePage,
  withoutEmptyProperties
} from '@vet/shared';
import { ProgramFilters } from '@vet/programs-common';
import { inject, Signal } from '@angular/core';
import { ProgramsService } from '@vet/backend';

export function useUnauthorizedUserPrograms() {
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
    loader: ({ request }) => {
      const { filters, page } = request;

      return programsService
        .programs({
          filter: JSON.stringify({
            ...filters,
            page,
          }),
        })
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
        );
    },
  });
}

export function useFoundUnauthorizedUserPrograms(filters: Signal<ProgramFilters>) {
  const programsService = inject(ProgramsService);
  const debouncedFilters = useDebounceValue<ProgramFilters>(
    filters,
    300,
    (a, b) => JSON.stringify(a) === JSON.stringify(b),
  );

  return rxResource<number | null, ProgramFilters>({
    request: debouncedFilters,
    defaultValue: null,
    loader: ({ request }) => {
      if (Object.keys(request).length === 0) {
        return of(0);
      }

      return programsService
        .programs({ filter: JSON.stringify(withoutEmptyProperties(request)) })
        .pipe(map((response) => response.meta?.total ?? 0));
    },
  });
}
