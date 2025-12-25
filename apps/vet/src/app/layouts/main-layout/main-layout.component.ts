import { Component, computed, DestroyRef, effect, inject, Injector, OnInit } from '@angular/core';
import { BreadcrumbComponent } from '@vet/shared/heavy-components';
import { ThemeService } from '@vet/shared/services';
import { NavbarComponent } from '@vet/shared/ui-components';
import { ActivatedRoute, NavigationEnd, Router, RouterOutlet } from '@angular/router';
import { AuthenticationService } from '@vet/auth';
import { filter } from 'rxjs';
import { AppFooterComponent } from '../../app-footer/app-footer.component';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { usePages } from '@vet/pages';

@Component({
  selector: 'vet-main-layout',
  imports: [RouterOutlet, NavbarComponent, BreadcrumbComponent, AppFooterComponent],
  templateUrl: './main-layout.component.html',
  styleUrl: './main-layout.component.scss',
})
export class MainLayoutComponent implements OnInit {
  protected readonly pages$ = usePages();
  protected readonly user = computed(() => this.authenticationService.user());
  protected injector = inject(Injector);
  protected router = inject(Router);
  protected route = inject(ActivatedRoute);
  protected themeService = inject(ThemeService);
  protected destroyRef = inject(DestroyRef);
  protected authenticationService = inject(AuthenticationService);

  protected logout() {
    this.authenticationService.logout();
  }

  ngOnInit(): void {
    this.updateThemeForRoute();
    effect(() => {
      this.authenticationService.isReady();
      this.authenticationService.isAuthenticated();
      this.updateThemeForRoute();
    }, { injector: this.injector });
    this.router.events
      .pipe(
        filter((e): e is NavigationEnd => e instanceof NavigationEnd),
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe(() => this.updateThemeForRoute());
  }

  private updateThemeForRoute(): void {
    const isHome = this.isHomeRoute();
    const isAuthReady = this.authenticationService.isReady();
    const isAuthenticated = this.authenticationService.isAuthenticated();

    if (isHome && isAuthReady && !isAuthenticated) {
      this.themeService.applyHomePageStyle();
    } else {
      this.themeService.removeHomePageStyle();
    }
  }

  private isHomeRoute(): boolean {
    let route: ActivatedRoute | null = this.route;

    while (route?.firstChild) {
      route = route.firstChild;
    }

    return route?.snapshot.data?.['isHome'] === true;
  }
}
