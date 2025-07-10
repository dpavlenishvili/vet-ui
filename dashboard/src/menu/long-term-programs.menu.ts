import { v4 as uuid } from 'uuid';
import { DashboardSidebarMenuItem } from '../dashboard.types';
import { computed, Signal, signal } from '@angular/core';

const BASE_PATH = '/dashboard/programs/long';

export function useLongTermProgramsMenu(): Signal<DashboardSidebarMenuItem> {
  const isExpanded = signal(false);

  return computed(() => ({
    id: uuid(),
    text: 'dashboard.long_term_programs',
    icon: 'professionalPrograms',
    url: BASE_PATH,
    isExpanded,
    children: [
      {
        id: uuid(),
        text: 'dashboard.registered_applicant',
        url: BASE_PATH,
      },
      {
        id: uuid(),
        text: 'dashboard.exam_schedule',
        url: `${BASE_PATH}/exam/selection`,
      },
      {
        id: uuid(),
        text: 'dashboard.commission_members',
        url: `${BASE_PATH}/commission/members`,
      },
      {
        id: uuid(),
        text: 'dashboard.commission_grading',
        url: `${BASE_PATH}/commission/review`,
      },
      {
        id: uuid(),
        text: 'dashboard.commission_results',
        url: `${BASE_PATH}/commission/results`,
      },
      {
        id: uuid(),
        text: 'dashboard.exam_card',
        url: `${BASE_PATH}/exam/card`,
      },
      {
        id: uuid(),
        text: 'dashboard.statistics',
        url: `${BASE_PATH}/statistics`,
      },
    ],
  }));
}
