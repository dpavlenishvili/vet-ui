import { Component, inject } from '@angular/core';
import { RouterLink, RouterOutlet } from '@angular/router';
import { NavbarComponent } from '@vet/shared';
import { AuthService } from '@vet/auth';
import { ApplicationPagesService } from '@vet/dynamic-pages';

@Component({
    standalone: true,
    selector: 'vet-main-layout',
    imports: [RouterOutlet, NavbarComponent, RouterLink],
    template: `
        <header>
            <v-ui-navbar [pages]="pages$()">
                <ng-container navbar-logo>
                    <a routerLink="/">
                        <img src="assets/evet-logo.svg" alt="Evet Logo" />
                        <div></div>
                        <div>პროფესიული განათლების პორტალი</div>
                    </a>
                </ng-container>
                <ng-container auth-content>
                    @if (tokenUser$()) {
                        <span>{{ tokenUser$()?.name }}</span>
                    } @else {
                        <a routerLink="/authorization" class="v-ui-navbar__link">ავტორიზაცია</a>
                        <a routerLink="/registration" class="v-ui-navbar__link v-ui-navbar__button">რეგისტრაცია</a>
                    }
                </ng-container>
            </v-ui-navbar>
        </header>
        <main class="main-container">
            <router-outlet></router-outlet>
        </main>
        <footer class="footer">
            <p>&copy; 2024 Your Company. All rights reserved.</p>
        </footer>
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
                padding: 20px 80px;
                margin: 0 auto;
                max-width: 1440px;
                width: 100%;
            }

            .footer {
                background-color: #f8f9fa;
                text-align: center;
                padding: 16px;
                border-top: 1px solid #ddd;
                font-size: 14px;
                color: #666;
            }
        `,
    ],
})
export class MainLayoutComponent {
    pages$ = inject(ApplicationPagesService).headerMenuPages$;
    tokenUser$ = inject(AuthService).tokenUser$;
}
