import { computed, signal } from '@angular/core';
import { DashboardSidebarMenuItem } from '../dashboard.types';
import { v4 as uuid } from 'uuid';
import { useLongTermProgramsMenu } from './long-term-programs.menu';
import { useShortTermProgramsMenu } from './short-term-programs.menu';

export function useDashboardMenu() {
  const longTermProgramsMenu = useLongTermProgramsMenu();
  const shortTermProgramsMenu = useShortTermProgramsMenu();

  return computed<DashboardSidebarMenuItem[]>(() => [
    longTermProgramsMenu(),
    shortTermProgramsMenu(),
    {
      id: uuid(),
      text: 'programs.informalEducation',
      icon: 'informalEducation',
      url: null,
      isExpanded: signal(false),
    },
    {
      id: uuid(),
      text: 'programs.orientationService',
      icon: 'orientationService',
      url: null,
      isExpanded: signal(false),
    },
    {
      id: uuid(),
      text: 'programs.governmentLanguageTrainingPrograms',
      icon: 'governmentLanguageTrainingPrograms',
      url: null,
      isExpanded: signal(false),
    },
    {
      id: uuid(),
      text: 'programs.teacherTrainingPrograms',
      icon: 'teacherTrainingPrograms',
      url: null,
      isExpanded: signal(false),
    },
    {
      id: uuid(),
      text: 'programs.collegeEmployment',
      icon: 'collegeEmployment',
      url: null,
      isExpanded: signal(false),
    },
  ]);
}
