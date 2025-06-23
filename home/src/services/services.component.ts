import { ChangeDetectionStrategy, Component, inject, input } from '@angular/core';
import { NgClass } from '@angular/common';
import { vetIcons } from '@vet/shared';
import { SVGIcon, SVGIconComponent } from '@progress/kendo-angular-icons';
import { TranslocoPipe } from '@jsverse/transloco';
import {Router, RouterLink} from '@angular/router';
import { AuthenticationService, CanPipe } from '@vet/auth';
import { AuthPermission } from '../../../auth/src/auth.types';

@Component({
  selector: 'vet-services',
  standalone: true,
  templateUrl: './services.component.html',
  styleUrl: './services.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [NgClass, SVGIconComponent, TranslocoPipe, RouterLink, CanPipe],
})
export class ServicesComponent {
  showTitle = input(true);
  readonly authenticated = inject(AuthenticationService).isAuthenticated;
  vetIcons = vetIcons;
  cards: ({
    text: string;
    icon: SVGIcon;
    color: string;
    url: string | null;
    permission?: AuthPermission;
  })[] = [
    {
      text: 'home.professionalPrograms',
      icon: vetIcons.professionalPrograms,
      color: 'blue',
      url: '/long-term-programs/list',
      permission: 'viewAnyProfessionProgramRegister' as AuthPermission,
    },
    {
      text: 'home.trainingPrograms',
      icon: vetIcons.trainingPrograms,
      color: 'yellow',
      url: null,
      permission: 'viewAnyProfessionProgramTesting' as AuthPermission,
    },
    {
      text: 'home.informalEducation',
      icon: vetIcons.informalEducation,
      color: 'green',
      url: null,
    },
    {
      text: 'home.orientationService',
      icon: vetIcons.orientationService,
      color: 'pink',
      url: null,
    },
    {
      text: 'home.governmentLanguageTrainingPrograms',
      icon: vetIcons.governmentLanguageTrainingPrograms,
      color: 'pink',
      url: null,
    },
    {
      text: 'home.teacherTrainingPrograms',
      icon: vetIcons.teacherTrainingPrograms,
      color: 'yellow',
      url: null,
    },
    {
      text: 'home.collegeEmployment',
      icon: vetIcons.collegeEmployment,
      color: 'blue',
      url: null,
    },
  ];
  router = inject(Router);
}
