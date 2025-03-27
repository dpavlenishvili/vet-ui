import { ChangeDetectionStrategy, Component, signal, WritableSignal } from '@angular/core';
import { ButtonComponent } from '@progress/kendo-angular-buttons';
import { vetIcons } from '@vet/shared';
import { SVGIcon, SVGIconComponent } from '@progress/kendo-angular-icons';
import { RouterLink } from '@angular/router';
import { TranslocoPipe } from '@jsverse/transloco';
import { v4 as uuid } from 'uuid';
import { TooltipDirective } from '@progress/kendo-angular-tooltip';

export interface LongTermProgramsSidebarMenuItemBase {
  id: string;
  text: string;
  isActive: boolean;
  url: string | null;
}

export interface LongTermProgramsSidebarMenuItem extends LongTermProgramsSidebarMenuItemBase {
  icon: SVGIcon;
  isExpanded: WritableSignal<boolean>;
  children?: LongTermProgramsSidebarMenuItemBase[];
}

@Component({
  selector: 'vet-long-term-programs-sidebar',
  imports: [ButtonComponent, SVGIconComponent, RouterLink, TranslocoPipe, TooltipDirective],
  templateUrl: './long-term-programs-sidebar.component.html',
  styleUrl: './long-term-programs-sidebar.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class LongTermProgramsSidebarComponent {
  vetIcons = vetIcons;
  isExpanded = signal(true);
  items = signal<LongTermProgramsSidebarMenuItem[]>([
    {
      id: uuid(),
      text: 'programs.professionalPrograms',
      icon: vetIcons.professionalPrograms,
      url: '/long-term-programs/list',
      isActive: true,
      isExpanded: signal(false),
      children: [
        {
          id: uuid(),
          text: 'programs.registeredApplicant',
          url: null,
          isActive: true,
        },
        {
          id: uuid(),
          text: 'programs.testingSchedule',
          url: null,
          isActive: false,
        },
        {
          id: uuid(),
          text: 'programs.commissionMembers',
          url: null,
          isActive: false,
        },
        {
          id: uuid(),
          text: 'programs.commissionGrade',
          url: null,
          isActive: false,
        },
        {
          id: uuid(),
          text: 'programs.commissionResults',
          url: null,
          isActive: false,
        },
        {
          id: uuid(),
          text: 'programs.testingCard',
          url: null,
          isActive: false,
        },
        {
          id: uuid(),
          text: 'programs.statistics',
          url: null,
          isActive: false,
        },
      ],
    },
    {
      id: uuid(),
      text: 'programs.trainingPrograms',
      icon: vetIcons.trainingPrograms,
      url: null,
      isActive: false,
      isExpanded: signal(false),
    },
    {
      id: uuid(),
      text: 'programs.informalEducation',
      icon: vetIcons.informalEducation,
      url: null,
      isActive: false,
      isExpanded: signal(false),
    },
    {
      id: uuid(),
      text: 'programs.orientationService',
      icon: vetIcons.orientationService,
      url: null,
      isActive: false,
      isExpanded: signal(false),
    },
    {
      id: uuid(),
      text: 'programs.governmentLanguageTrainingPrograms',
      icon: vetIcons.governmentLanguageTrainingPrograms,
      url: null,
      isActive: false,
      isExpanded: signal(false),
    },
    {
      id: uuid(),
      text: 'programs.teacherTrainingPrograms',
      icon: vetIcons.teacherTrainingPrograms,
      url: null,
      isActive: false,
      isExpanded: signal(false),
    },
    {
      id: uuid(),
      text: 'programs.collegeEmployment',
      icon: vetIcons.collegeEmployment,
      url: null,
      isActive: false,
      isExpanded: signal(false),
    },
  ]);

  isItemHighlighted(item: LongTermProgramsSidebarMenuItem) {
    return item.isActive && (!this.isExpanded() || item.isExpanded());
  }

  onToggleExpansion() {
    this.isExpanded.update((value) => !value);

    if (!this.isExpanded()) {
      this.items().forEach((item) => {
        item.isExpanded.set(false);
      });
    }
  }

  onItemClick(target: LongTermProgramsSidebarMenuItem) {
    if (target.children?.length) {
      if (!target.isExpanded() && !this.isExpanded()) {
        this.onToggleExpansion();
      }

      this.items().forEach((item) => {
        if (item.id === target.id) {
          item.isExpanded.update((value) => !value);
        }
      });
    }
  }
}
