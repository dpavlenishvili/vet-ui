import { v4 as uuid } from 'uuid';
import { computed, inject, Signal, signal } from '@angular/core';
import { isOneOf, UserRolesService } from '@vet/auth';
import { SidebarMenuItem } from '../../../apps/vet/src/app/shell/sidebar/sidebar-menu-item.type';

const BASE_PATH = '/dashboard/programs/long';

export function useLongTermProgramsMenu(): Signal<SidebarMenuItem> {
  const userRolesService = inject(UserRolesService);
  const isExpanded = signal(false);

  return computed(() => {
    const isNonDefaultUser = userRolesService.hasRole('Organisation') || userRolesService.hasRole('Super Admin');

    return {
      id: uuid(),
      text: 'dashboard.long_term_programs',
      icon: 'professionalPrograms',
      url: isNonDefaultUser ? `${BASE_PATH}/registered-applicant` : BASE_PATH,
      isExpanded,
      children: [
        {
          id: uuid(),
          text: 'dashboard.registered_applicant',
          url: `${BASE_PATH}/registered-applicant`,
          accessControl: isOneOf('Super Admin', 'Organisation'),
        },
        {
          id: uuid(),
          text: 'dashboard.exam_schedule',
          url: `${BASE_PATH}/exam/selection`,
          accessControl: isOneOf('Super Admin', 'Organisation'),
        },
        {
          id: uuid(),
          text: 'dashboard.commission_members',
          url: `${BASE_PATH}/commission/members`,
          accessControl: isOneOf('Super Admin', 'Organisation'),
        },
        {
          id: uuid(),
          text: 'dashboard.commission_grading',
          url: `${BASE_PATH}/commission/review`,
          accessControl: isOneOf('Super Admin', 'Organisation'),
        },
        {
          id: uuid(),
          text: 'dashboard.commission_results',
          url: `${BASE_PATH}/commission/results`,
          accessControl: isOneOf('Super Admin', 'Organisation'),
        },
        {
          id: uuid(),
          text: 'dashboard.exam_card',
          url: `${BASE_PATH}/exam/card`,
          accessControl: isOneOf('Super Admin', 'Organisation'),
        },
        {
          id: uuid(),
          text: 'dashboard.statistics',
          url: `${BASE_PATH}/statistics`,
          accessControl: isOneOf('Super Admin', 'Organisation'),
        },
      ],
    };
  });
}
