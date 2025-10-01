import { v4 as uuid } from 'uuid';
import { computed, inject, Signal, signal } from '@angular/core';
import { isOneOf, UserRolesService } from '@vet/auth';
import { SidebarMenuItem } from '@vet/shared';

const BASE_PATH = '/dashboard/programs/short';

export function useShortTermProgramsMenu(): Signal<SidebarMenuItem> {
  const userRolesService = inject(UserRolesService);

  const isExpanded = signal(false);
  const organisationId = userRolesService.getOrganisationId();

  return computed(() => ({
    id: uuid(),
    text: 'dashboard.short_term_programs',
    icon: 'trainingPrograms',
    url: BASE_PATH,
    isExpanded,
    children: [
      {
        id: uuid(),
        text: 'dashboard.registered_listeners',
        url: BASE_PATH,
        accessControl: isOneOf('Super Admin', 'Organisation'),
      },
      {
        id: uuid(),
        text: 'dashboard.statistics',
        url: userRolesService.hasRole('Super Admin')
          ? `${BASE_PATH}/statistics`
          : `${BASE_PATH}/statistics/${organisationId}`,
        accessControl: isOneOf('Super Admin', 'Organisation'),
      },
    ],
  }));
}
