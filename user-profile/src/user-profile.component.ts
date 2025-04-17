import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { ToastModule, vetIcons } from '@vet/shared';
import { SVGIconModule } from '@progress/kendo-angular-icons';
import { TranslocoPipe } from '@jsverse/transloco';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { ButtonComponent } from '@progress/kendo-angular-buttons';
import { TooltipDirective } from '@progress/kendo-angular-tooltip';

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
  protected readonly vetIcons = vetIcons;
  protected readonly menuItems = [
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
}
