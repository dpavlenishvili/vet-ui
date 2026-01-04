import { Component, computed, DestroyRef, effect, inject, OnInit, signal } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router, RouterOutlet } from '@angular/router';
import { ThemeSidebarComponent } from './theme-sidebar/theme-sidebar.component';
import { KENDO_DIALOGS } from '@progress/kendo-angular-dialog';
import { AlertDialogOutletComponent, ConfirmationDialogOutletComponent, DialogOutletComponent } from '@vet/shared/dialogs';
import { AuthenticationService, UserRolesService } from '@vet/auth';
import { TranslocoPipe } from '@jsverse/transloco';
import { ThemeService } from '@vet/shared/services';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { filter } from 'rxjs';

@Component({
  standalone: true,
  imports: [
    RouterOutlet,
    ThemeSidebarComponent,
    KENDO_DIALOGS,
    ConfirmationDialogOutletComponent,
    AlertDialogOutletComponent,
    DialogOutletComponent,
    TranslocoPipe
  ],
  selector: 'vet-root',
  template: `
    @if (isAppReady()) {
      <div class="vet-development-mode">
        <p class="vet-development-mode-text">
          {{'shared.in_dev_mode' | transloco}}
        </p>
      </div>

      <vet-theme-sidebar [open]="isOpen()" />

      <router-outlet />
      <div kendoDialogContainer></div>
      <vet-confirmation-dialog-outlet />
      <vet-alert-dialog-outlet />
      <vet-dialog-outlet />
    } @else {
      <div class="loading-container">
        <svg
          class="spinner"
          width="48"
          height="48"
          viewBox="0 0 16 16"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M8 1C8.55228 1 9 0.552285 9 0C9 -0.552285 8.55228 -1 8 -1C3.58172 -1 0 2.58172 0 7C0 7.55228 0.447715 8 1 8C1.55228 8 2 7.55228 2 7C2 3.68629 4.68629 1 8 1Z"
            fill="#4CAEE8"
          />
        </svg>
      </div>
    }
  `,
  styles: [
    `
      :host {
        display: block;
        min-height: 100%;
        height: 100%;
        --app-top-offset: 0px;
        --dev-banner-font-size: 0.75rem;
        --dev-banner-line-height: 1.4;
        --dev-banner-padding-y: 0.5rem;
      }

      :host(.has-dev-banner) {
        --app-top-offset: calc(
          (var(--dev-banner-font-size) * var(--dev-banner-line-height)) +
          (var(--dev-banner-padding-y) * 2) +
          1px
        );
      }

      .loading-container {
        display: flex;
        justify-content: center;
        align-items: center;
        height: 100vh;
        width: 100vw;
      }

      .spinner {
        animation: spin 1s linear infinite;
      }

      @keyframes spin {
        from {
          transform: rotate(0deg);
        }
        to {
          transform: rotate(360deg);
        }
      }

      .vet-development-mode {
        padding: var(--dev-banner-padding-y) 1rem;
        background: linear-gradient(135deg, #f0f2f5 0%, #e5e7eb 100%);
        border-bottom: 1px solid #d1d5db;

        .vet-development-mode-text {
          text-align: center;
          font-size: var(--dev-banner-font-size);
          font-weight: 500;
          line-height: var(--dev-banner-line-height);
          color: #4a5565;
          margin: 0;
        }
      }

      :host-context([data-theme='dark']) .vet-development-mode {
        background: linear-gradient(135deg, #1e293b 0%, #0f172a 100%);
        border-bottom: 1px solid #334155;

        .vet-development-mode-text {
          color: #94a3b8;
        }
      }
    `,
  ],
  host: {
    ngSkipHydration: '',
    '[class.has-dev-banner]': 'isAppReady()',
  },
})
export class AppComponent implements OnInit {
  isOpen = signal(false);
  private readonly homeStyleState = signal<boolean | null>(null);
  authService = inject(AuthenticationService);
  userRolesService = inject(UserRolesService);
  router = inject(Router);
  route = inject(ActivatedRoute);
  themeService = inject(ThemeService);
  destroyRef = inject(DestroyRef);

  isAppReady = computed(() => {
    const authReady = this.authService.isReady();
    const rolesLoaded = this.userRolesService.isUserAccountsLoaded();
    return authReady && rolesLoaded;
  });

  constructor() {
    effect(() => {
      this.authService.isReady();
      this.authService.hasTokens();
      this.updateThemeForRoute();
    });
  }

  ngOnInit(): void {
    this.updateThemeForRoute();

    this.router.events
      .pipe(
        filter((e): e is NavigationEnd => e instanceof NavigationEnd),
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe(() => this.updateThemeForRoute());
  }

  private updateThemeForRoute(): void {
    const isHome = this.isHomeRoute();
    const isAuthReady = this.authService.isReady();
    const isAuthorized = this.authService.hasTokens();

    if (!isHome) {
      if (this.homeStyleState() !== false) {
        this.themeService.removeHomePageStyle();
        this.homeStyleState.set(false);
      }
      return;
    }

    if (!isAuthReady) {
      return;
    }

    const shouldApply = !isAuthorized;
    if (this.homeStyleState() === shouldApply) {
      return;
    }

    if (shouldApply) {
      this.themeService.applyHomePageStyle();
    } else {
      this.themeService.removeHomePageStyle();
    }

    this.homeStyleState.set(shouldApply);
  }

  private isHomeRoute(): boolean {
    let route: ActivatedRoute | null = this.route;

    while (route?.firstChild) {
      route = route.firstChild;
    }

    return route?.snapshot.data?.['isHome'] === true;
  }
}
