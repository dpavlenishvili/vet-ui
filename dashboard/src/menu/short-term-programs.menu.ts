import { DashboardSidebarMenuItem, DashboardSidebarMenuItemBase } from '../dashboard.types';
import { v4 as uuid } from 'uuid';
import { computed, Signal, signal } from '@angular/core';
import { isOneOf, useHasRole } from '@vet/auth';

const BASE_PATH = '/dashboard/programs/short';

export function useShortTermProgramsMenu(): Signal<DashboardSidebarMenuItem> {
  const isExpanded = signal(false);

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
        url: `${BASE_PATH}/statistics`,
        accessControl: isOneOf('Super Admin'),
      },
    ],
  }));
}
