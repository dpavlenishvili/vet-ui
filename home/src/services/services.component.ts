import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { NgClass } from '@angular/common';
import { IconComponent, VetIcon } from '@vet/shared';
import { TranslocoPipe } from '@jsverse/transloco';
import { Router, RouterLink } from '@angular/router';
import {
  AccessControl,
  AuthenticationService,
  AuthPermission,
  HasAccessPipe,
  isAuthenticated,
  isGuest,
} from '@vet/auth';

export interface ServiceItem {
  text: string;
  icon: VetIcon;
  color: string;
  url: string | null;
  permission?: AuthPermission;
  accessControl?: AccessControl;
}

@Component({
  selector: 'vet-services',
  standalone: true,
  templateUrl: './services.component.html',
  styleUrl: './services.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [NgClass, TranslocoPipe, RouterLink, IconComponent, HasAccessPipe],
})
export class ServicesComponent {
  isAuthenticated = inject(AuthenticationService).isAuthenticated;
  router = inject(Router);

  showTitle = computed(() => !this.isAuthenticated());
  cards: ServiceItem[] = [
    {
      // გრძელ ვადიანებში: თუ არა-ავტორიზებულია, მაშინ ზოგადი პროგრამების სია უნდა ვუჩვენოთ
      accessControl: isGuest(),
      text: 'home.professionalPrograms',
      icon: 'professionalPrograms',
      color: 'blue',
      url: 'programs',
    },
    {
      // გრძელ ვადიანებში: თუ ავტორიზებულია, მაშინ პროგრამების დეშბორდი უნდა ვუჩვენოთ
      accessControl: isAuthenticated(),
      text: 'home.professionalPrograms',
      icon: 'professionalPrograms',
      color: 'blue',
      url: '/dashboard/programs/long',
    },
    {
      // მოკლე ვადიანებში: თუ არა-ავტორიზებულია, მაშინ ზოგადი პროგრამების სია უნდა ვუჩვენოთ
      accessControl: isGuest(),
      text: 'home.trainingPrograms',
      icon: 'trainingPrograms',
      color: 'yellow',
      url: '/programs/short',
    },
    {
      // მოკლე ვადიანებში: თუ ავტორიზებულია, მაშინ პროგრამების დეშბორდი უნდა ვუჩვენოთ
      accessControl: isAuthenticated(),
      text: 'home.trainingPrograms',
      icon: 'trainingPrograms',
      color: 'yellow',
      url: '/dashboard/programs/short',
    },
    {
      text: 'home.informalEducation',
      icon: 'informalEducation',
      color: 'green',
      url: null,
    },
    {
      text: 'home.orientationService',
      icon: 'orientationService',
      color: 'pink',
      url: null,
    },
    {
      text: 'home.governmentLanguageTrainingPrograms',
      icon: 'governmentLanguageTrainingPrograms',
      color: 'pink',
      url: null,
    },
    {
      text: 'home.teacherTrainingPrograms',
      icon: 'teacherTrainingPrograms',
      color: 'yellow',
      url: null,
    },
    {
      text: 'home.collegeEmployment',
      icon: 'collegeEmployment',
      color: 'blue',
      url: null,
    },
  ];
}
