import { Component, computed, DestroyRef, inject, OnInit } from '@angular/core';
import { BreadcrumbComponent, NavbarComponent, ThemeService } from '@vet/shared';
import { NavigationEnd, Router, RouterOutlet } from '@angular/router';
import { ApplicationPagesService } from '@vet/dynamic-pages';
import { AuthenticationService } from '@vet/auth';
import { filter, take } from 'rxjs';
import { AppFooterComponent } from '../../app-footer/app-footer.component';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
  selector: 'vet-main-layout',
  imports: [RouterOutlet, NavbarComponent, BreadcrumbComponent, AppFooterComponent],
  templateUrl: './main-layout.component.html',
  styleUrl: './main-layout.component.scss',
})
export class MainLayoutComponent implements OnInit {
  protected readonly pages$ = inject(ApplicationPagesService).headerMenuPages$;
  protected readonly user = computed(() => this.authenticationService.user());
  protected router = inject(Router);
  protected themeService = inject(ThemeService);
  protected destroyRef = inject(DestroyRef);
  protected authenticationService = inject(AuthenticationService);

  protected logout() {
    this.authenticationService.logout().pipe(take(1)).subscribe();
  }

  ngOnInit(): void {
    // Apply/remove style on startup
    this.updateThemeForUrl(this.router.url);

    // Re-run on every navigation
    this.router.events
      .pipe(
        filter((e): e is NavigationEnd => e instanceof NavigationEnd),
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe((e) => this.updateThemeForUrl(e.urlAfterRedirects));
  }

  private updateThemeForUrl(url: string) {
    if (url === '/' || url.startsWith('/home')) {
      this.themeService.applyHomePageStyle();
    } else {
      this.themeService.removeHomePageStyle();
    }
  }
}
