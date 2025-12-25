import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { NgClass } from '@angular/common';
import { VetIcon } from '@vet/shared/icons';
import { IconComponent } from '@vet/shared/ui-components';
import { TranslocoPipe } from '@jsverse/transloco';
import { Router, RouterLink } from '@angular/router';
import {
  AccessControl,
  AuthenticationService,
  AuthPermission,
  HasAccessPipe,
  isAuthenticated,
  isGuest,
  isOneOf,
  UserRolesService,
  useAccessControl,
} from '@vet/auth';

export interface ServiceItem {
  text: string;
  description?: string;
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
  userRolesService = inject(UserRolesService);
  private readonly _hasAccess = useAccessControl();

  isNonDefaultUser = computed(() =>
    this.userRolesService.hasRole('Organisation') || this.userRolesService.hasRole('Super Admin')
  );

  showTitle = computed(() => !this.isAuthenticated());
  cards: ServiceItem[] = [
    {
      accessControl: isGuest(),
      text: 'home.professionalPrograms',
      description: 'home.professionalPrograms.description',
      icon: 'professionalPrograms',
      color: 'blue',
      url: 'programs',
    },
    {
      accessControl: isAuthenticated(),
      text: 'home.professionalPrograms',
      description: 'home.professionalPrograms.description',
      icon: 'professionalPrograms',
      color: 'blue',
      url: '/dashboard/programs/long',
    },
    {
      accessControl: isGuest(),
      text: 'home.trainingPrograms',
      description: 'home.trainingPrograms.description',
      icon: 'trainingPrograms',
      color: 'yellow',
      url: '/programs/short',
    },
    {
      accessControl: isAuthenticated(),
      text: 'home.trainingPrograms',
      description: 'home.trainingPrograms.description',
      icon: 'trainingPrograms',
      color: 'yellow',
      url: this.isNonDefaultUser() ? '/dashboard/programs/short/registered-listeners' : '/dashboard/programs/short',
    },
    {
      accessControl: isGuest(),
      text: 'home.informalEducation',
      description: 'home.informalEducation.description',
      icon: 'informalEducation',
      color: 'green',
      url: '/programs/non-formal',
    },
    {
      accessControl: (isAuthenticated() && isOneOf('Default User')),
      text: 'home.informalEducation',
      description: 'home.informalEducation.description',
      icon: 'informalEducation',
      color: 'green',
      url: '/dashboard/programs/non-formal',
    },
  ];

  visibleCards = computed(() => {
    const allowed = this.cards.filter((card) => {
      if (!card.accessControl) {
        return true;
      }
      return this._hasAccess(card.accessControl)();
    });
    return allowed;
  });
}
