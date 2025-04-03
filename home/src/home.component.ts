import { ChangeDetectionStrategy, Component, DestroyRef, inject } from '@angular/core';
import { PostsComponent } from './posts/posts.component';
import { PartnersComponent } from './partners/partners.component';
import { ServicesComponent } from './services/services.component';
import { ThemeService } from '@vet/shared';
import { AuthenticationService } from '@vet/auth';

@Component({
  selector: 'vet-home',
  imports: [PostsComponent, PartnersComponent, ServicesComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HomeComponent {
  readonly authenticated = inject(AuthenticationService).isAuthenticated;

  constructor() {
    const themeService = inject(ThemeService);
    themeService.applyHomePageStyle();
    inject(DestroyRef).onDestroy(() => {
      themeService.removeHomePageStyle();
    });
  }
}
