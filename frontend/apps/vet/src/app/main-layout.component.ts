import { Component } from '@angular/core';
import { NavbarComponent, NavbarLogoDirective } from '@vet/ui/navbar';
import { RouterLink, RouterOutlet } from '@angular/router';

@Component({
    standalone: true,
    imports: [NavbarComponent, RouterOutlet, RouterLink, NavbarLogoDirective],
    template: `
        <header>
            <nav v-ui-navbar>
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
export class MainLayoutComponent {}
