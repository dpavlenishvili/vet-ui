import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { ToastModule, vetIcons } from '@vet/shared';
import { SVGIconModule } from '@progress/kendo-angular-icons';
import { TranslocoPipe } from '@jsverse/transloco';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { ButtonComponent } from '@progress/kendo-angular-buttons';
import { TooltipDirective } from '@progress/kendo-angular-tooltip';
import { UserRolesService } from '@vet/auth';

@Component({
  selector: 'vet-user-profile',
  imports: [
    SVGIconModule,
    TranslocoPipe,
    ToastModule,
    RouterLink,
    RouterLinkActive,
    RouterOutlet,
    ButtonComponent,
    TooltipDirective,
  ],
  templateUrl: './user-profile.component.html',
  styleUrl: './user-profile.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UserProfileComponent {
  private readonly userRolesService = inject(UserRolesService);
  protected readonly vetIcons = vetIcons;
  protected readonly allMenuItems = [
    {
      text: 'my_profile',
      icon: '/assets/images/my-profile.svg',
      url: ['/user-profile', 'overview'],
    },
    {
      text: 'password',
      icon: '/assets/images/password.svg',
      url: ['/user-profile', 'password'],
    },
    {
      text: 'interest_areas',
      icon: '/assets/images/interest-areas.svg',
      url: ['/user-profile', 'interest-areas'],
    },
    {
      text: 'terms_conditions',
      icon: '/assets/images/termsAndConditions.svg',
      url: ['/user-profile', 'terms-conditions'],
    },
    {
      text: 'my_messages',
      icon: '/assets/images/bell-icon.svg',
      url: ['/user-profile', 'my-messages'],
    },
  ];
  isExpanded = signal(true);

  onToggleExpansion() {
    this.isExpanded.update((value) => !value);
  }

  get menuItems() {
    const alwaysVisible = ['my_profile', 'my_messages'];
    return this.allMenuItems.filter((item) => alwaysVisible.includes(item.text) || this.hasAllItemsAccess());
  }

  hasAllItemsAccess() {
    return this.userRolesService.hasRole('Default User') || this.userRolesService.hasRole('Super Admin');
  }
}
