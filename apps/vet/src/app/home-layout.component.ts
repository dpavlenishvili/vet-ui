import { Component, inject } from '@angular/core';
import { AppFooterComponent } from './app-footer/app-footer.component';
import { NavbarComponent } from '@vet/shared';
import { RouterOutlet } from '@angular/router';
import { ApplicationPagesService } from '@vet/dynamic-pages';

@Component({
  selector: 'vet-home-layout',
  imports: [AppFooterComponent, NavbarComponent, RouterOutlet],
  template: `
    <header>
      <vet-ui-navbar [pages]="pages$()" />
    </header>

    <main class="main-container">
      <div class="router-container k-mt-14">
        <router-outlet />
      </div>
    </main>

    <vet-app-footer [divider]="true" />
  `,
  styles: [
    `
      :host {
        display: flex;
        flex-direction: column;
        min-height: 100vh;
        --main-bg: #ffffff;
      }

      .main-container {
        flex: 1;
        width: 100%;
        padding: 0 0 150px;
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
export class HomeLayoutComponent {
  pages$ = inject(ApplicationPagesService).headerMenuPages$;
}
