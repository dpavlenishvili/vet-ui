import { DashboardSidebarMenuItem } from '../dashboard.types';
import { v4 as uuid } from 'uuid';
import { computed, inject, Signal, signal } from '@angular/core';
import { UserRolesService, isOneOf } from '@vet/auth';

const BASE_PATH = '/dashboard/programs/short';

export function useShortTermProgramsMenu(): Signal<DashboardSidebarMenuItem> {
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
