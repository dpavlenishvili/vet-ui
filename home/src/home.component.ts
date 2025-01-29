import { ChangeDetectionStrategy, Component, inject, OnDestroy, OnInit } from '@angular/core';
import { PostsComponent } from './posts/posts.component';
import { PartnersComponent } from './partners/partners.component';
import { ServicesComponent } from './services/services.component';
import { ThemeService } from '@vet/shared';
import { CustomAuthService } from '@vet/auth';

@Component({
  selector: 'vet-home',
  imports: [PostsComponent, PartnersComponent, ServicesComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
})
export class HomeComponent implements OnInit, OnDestroy {
  authenticated = inject(CustomAuthService).authenticated$;
  private themeService = inject(ThemeService);

  ngOnInit(): void {
    this.themeService.applyHomePageStyle();
  }

  ngOnDestroy(): void {
    this.themeService.removeHomePageStyle();
  }
}
