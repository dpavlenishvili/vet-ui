import { Component, inject } from '@angular/core';
import { RouterLink, RouterOutlet } from '@angular/router';

import { AuthenticatedDirective, AuthenticationService } from '@vet/auth';
import { ButtonComponent, NavbarComponent, NavbarLogoDirective } from '@vet/shared';
import { ApplicationPagesService } from '@vet/dynamic-pages';

@Component({
  // eslint-disable-next-line @angular-eslint/component-selector
  selector: 'vet-main-layout',
  standalone: true,
  imports: [
    NavbarComponent,
    RouterOutlet,
    RouterLink,
    NavbarLogoDirective,
    AuthenticatedDirective,
    ButtonComponent,
    NavbarComponent,
    NavbarLogoDirective,
    AuthenticatedDirective,
    ButtonComponent,
  ],
  template: `
    <header>
        ჰედერი
    </header>
    <main class="main-container">
      <router-outlet></router-outlet>
    </main>
    <footer>
        ფუტერი
    </footer>
  `,
  styles: [
    `
        :host {
            display: block;
            min-height: 100%;
            height: 100%;
            .main-container {
                height: 100%;
            }
        }
    `,
  ],
})
export class MainLayoutComponent {
  pages$ = inject(ApplicationPagesService).headerMenuPages$;
  tokenUser$ = inject(AuthenticationService).tokenUser$;
}
