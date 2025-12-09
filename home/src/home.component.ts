import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { PostsComponent } from './posts/posts.component';
import { ServicesComponent } from './services/services.component';
import { AuthenticationService } from '@vet/auth';

@Component({
  selector: 'vet-home',
  imports: [PostsComponent, ServicesComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HomeComponent {
  readonly authenticated = inject(AuthenticationService).isAuthenticated;
}
