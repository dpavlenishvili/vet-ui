import { rxResource } from '@angular/core/rxjs-interop';
import { inject } from '@angular/core';
import { NonFormalService } from '@vet/backend';
import { map } from 'rxjs';
import { flattenQueryParams, PaginatedGridResult, useFilters, usePage } from '@vet/shared';
import { ProgramFilters } from '@vet/programs-common';

export function useNonFormalPrograms() {
  const nonFormalService = inject(NonFormalService);
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
      nonFormalService
        .nonFormals({
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
