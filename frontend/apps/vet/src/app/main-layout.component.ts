import { Component, inject } from '@angular/core';
import { NavbarComponent, NavbarLogoDirective } from '@vet/ui/navbar';
import { RouterLink, RouterOutlet } from '@angular/router';
import { ApplicationPagesService } from './application-pages.service';

@Component({
    standalone: true,
    imports: [NavbarComponent, RouterOutlet, RouterLink, NavbarLogoDirective],
    template: `
        <header>
            <nav v-ui-navbar [pages]="pages$()">
                <a routerLink="/" *vUiNavbarLogo>
                    <img src="assets/evet-logo.svg" alt="Evet Logo" />
                </a>
            </nav>
        </header>
        <main>
            <router-outlet></router-outlet>
        </main>
    `,
    styles: [
        `
            :host {
                display: flex;
                flex-direction: column;
                flex-grow: 1;
            }
        `,
    ],
})
export class MainLayoutComponent {
    pages$ = inject(ApplicationPagesService).headerMenuPages$;
}
