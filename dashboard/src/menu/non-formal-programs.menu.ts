import { v4 as uuid } from 'uuid';
import { computed, Signal, signal } from '@angular/core';
import { isOneOf } from '@vet/auth';
import { SidebarMenuItem } from '@vet/shared';

const BASE_PATH = '/dashboard/programs/non-formal';

export function useNonFormalProgramsMenu(): Signal<SidebarMenuItem> {
  const isExpanded = signal(false);

  return computed(() => ({
    id: uuid(),
    text: 'dashboard.non_formal_programs',
    icon: 'professionalPrograms',
    url: BASE_PATH,
    isExpanded,
    children: [
      {
        id: uuid(),
        text: 'non_formal.applications',
        url: BASE_PATH,
        accessControl: isOneOf('Super Admin', 'Organisation'),
      },
    ],
  }));
}
