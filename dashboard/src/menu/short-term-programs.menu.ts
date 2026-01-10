import { v4 as uuid } from 'uuid';
import { computed, inject, Signal, signal } from '@angular/core';
import { isOneOf, UserRolesService } from '@vet/auth';
import { SidebarMenuItem } from '../../../apps/vet/src/app/shell/sidebar/sidebar-menu-item.type';

const BASE_PATH = '/dashboard/programs/short';

export function useShortTermProgramsMenu(): Signal<SidebarMenuItem> {
  const userRolesService = inject(UserRolesService);
  const isExpanded = signal(false);

  return computed(() => {
    const organisationId = userRolesService.getOrganisationId();
    const organisation = userRolesService.getOrganisationName();
    const isNonDefaultUser = userRolesService.hasRole('Organisation') || userRolesService.hasRole('Super Admin');

    return {
      id: uuid(),
      text: 'dashboard.short_term_programs',
      icon: 'trainingPrograms',
      url: isNonDefaultUser ? `${BASE_PATH}/registered-listeners` : BASE_PATH,
      isExpanded,
      children: [
        {
          id: uuid(),
          text: 'dashboard.registered_listeners',
          url: `${BASE_PATH}/registered-listeners`,
          accessControl: isOneOf('Super Admin', 'Organisation'),
        },
        {
          id: uuid(),
          text: 'dashboard.statistics',
          url: userRolesService.hasRole('Super Admin')
            ? `${BASE_PATH}/statistics`
            : `${BASE_PATH}/statistics/${organisationId}?orgName=${organisation}`,
          accessControl: isOneOf('Super Admin', 'Organisation'),
        },
      ],
    };
  });
}
