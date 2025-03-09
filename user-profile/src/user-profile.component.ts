import { ChangeDetectionStrategy, Component } from '@angular/core';
import { ToastModule } from '@vet/shared';
import { SVGIconModule } from '@progress/kendo-angular-icons';
import { TranslocoPipe } from '@jsverse/transloco';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';

@Component({
  selector: 'vet-user-profile',
  imports: [SVGIconModule, TranslocoPipe, ToastModule, RouterLink, RouterLinkActive, RouterOutlet],
  templateUrl: './user-profile.component.html',
  styleUrl: './user-profile.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UserProfileComponent {
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
}
