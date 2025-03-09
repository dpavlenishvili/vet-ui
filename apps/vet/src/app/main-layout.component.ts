import { Component, computed, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { BreadcrumbComponent, NavbarComponent } from '@vet/shared';
import { ApplicationPagesService } from '@vet/dynamic-pages';
import { AppFooterComponent } from './app-footer/app-footer.component';
import { AuthenticationService, UserRolesService} from '@vet/auth';
import { take } from 'rxjs';

@Component({
  selector: 'vet-main-layout',
  imports: [RouterOutlet, NavbarComponent, BreadcrumbComponent, AppFooterComponent],
  template: `
    <header>
      <vet-ui-navbar
        [pages]="pages$()"
        [roles]="roles()"
        [user]="user()"
        (logout)="logout()"
      />
    </header>

    <main class="main-container">
      <vet-breadcrumb />

      <div class="router-container">
        <router-outlet />
      </div>
    </main>

    <vet-app-footer />
  `,
  styles: [
    `
      :host {
        display: flex;
        flex-direction: column;
        min-height: 100vh;
      }

      .main-container {
        flex: 1;
        max-width: 1440px;
        margin: 0 auto;
        width: 100%;
        padding: 0 80px 150px 80px;
        background: var(--main-bg);

        @media (max-width: 768px) {
          padding: 14px 30px 150px 30px;
        }
      }

      .router-container {
        height: 100%;
      }
    `,
  ],
  standalone: true,
})
export class MainLayoutComponent {
  protected readonly pages$ = inject(ApplicationPagesService).headerMenuPages$;
  protected readonly roles = computed(() => this.userRolesService.roles());
  protected readonly user = computed(() => this.authenticationService.user());
  protected userRolesService = inject(UserRolesService);
  protected authenticationService = inject(AuthenticationService);

  protected logout() {
    this.authenticationService
      .logout()
      .pipe(take(1))
      .subscribe();
  }
}
