import { Component, inject, input } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { BreadcrumbComponent, NavbarComponent } from '@vet/shared';
import { ApplicationPagesService } from '@vet/dynamic-pages';
import { AppFooterComponent } from './app-footer/app-footer.component';

@Component({
  selector: 'vet-main-layout',
  imports: [RouterOutlet, NavbarComponent, BreadcrumbComponent, AppFooterComponent],
  template: `
    <header>
      <vet-ui-navbar [pages]="pages$()"/>
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
  pages$ = inject(ApplicationPagesService).headerMenuPages$;
}
