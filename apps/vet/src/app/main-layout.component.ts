import { Component } from '@angular/core';
import { RouterLink, RouterOutlet } from '@angular/router';

import { AuthenticatedDirective } from '@vet/auth';

@Component({
    // eslint-disable-next-line @angular-eslint/component-selector
    selector: 'vet-main-layout',
    standalone: true,
    imports: [RouterOutlet, RouterLink, AuthenticatedDirective, AuthenticatedDirective],
    template: `
        <header>ჰედერი</header>
        <main class="main-container">
            <router-outlet></router-outlet>
        </main>
        <footer>ფუტერი</footer>
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
export class MainLayoutComponent {}
