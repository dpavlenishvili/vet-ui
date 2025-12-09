import { OrganisationsService } from './../../backend/src/lib/generated/organisations';
import { Signal, inject } from '@angular/core';
import { rxResource } from '@angular/core/rxjs-interop';
// import { OrganisationsService } from '@vet/backend';
import { OrganisationFilters } from './organisations.types';
import { GeneralsService } from '@vet/backend';
import { map } from 'rxjs';

function buildOrganisationsQuery(f: OrganisationFilters, page: number, perPage: number) {
  const query: Record<string, string | number> = {};

  if (f.search !== undefined) query['filters[search]'] = f.search;
  if (f.id !== undefined) query['filters[id]'] = f.id;
  if (f.name !== undefined) query['filters[name]'] = f.name;
  if (f.region !== undefined) query['filters[region]'] = f.region;
  if (f.district !== undefined) query['filters[district]'] = f.district;
  if (f.org_type !== undefined) query['filters[org_type]'] = f.org_type;
  if (f.institution_type_id !== undefined) query['filters[institution_type_id]'] = f.institution_type_id;

  query['per_page'] = perPage;
  query['page'] = page;

  return query;
}

export function useOrganisationsList(filters: Signal<OrganisationFilters>, page: Signal<number>, perPage = 5) {
  const organisationsService = inject(OrganisationsService);

  return rxResource({
    request: () => ({ filters: filters(), page: page() }),
    loader: ({ request }) => {
      return organisationsService.organisations(buildOrganisationsQuery(request.filters, request.page, perPage));
    },
  });
}

export function useSingleOrganisation(id: number) {
  const organisationsService = inject(OrganisationsService);

  return rxResource({
    request: () => ({ id }),
    loader: ({ request }) => {
      return organisationsService.showOrganisation(request.id);
    },
  });
}

export function useInstitutionTypes() {
  const generalsService = inject(GeneralsService);

  return rxResource({
    request: () => ({ key: 'institution_types' }),
    loader: ({ request }) => {
      return generalsService.getAllConfigs(request).pipe(
        map((response) =>
          (response.institution_types ?? [])
            .filter((item): item is { id: string; value: string } => !!item.value && !!item.id)
            .map((item) => ({
              label: item.value,
              value: item.id,
            })),
        ),
      );
    },
  });
}

export function useInstitutionOrgType() {
  const generalsService = inject(GeneralsService);

  return rxResource({
    request: () => ({ key: 'institution_org_type' }),
    loader: ({ request }) => {
      return generalsService.getAllConfigs(request).pipe(
        map((response) =>
          (response.institution_org_type ?? [])
            .filter((item): item is { id: string; value: string } => !!item.value && !!item.id)
            .map((item) => ({
              label: item.value,
              value: item.id,
            })),
        ),
      );
    },
  });
}
