import { Component, ContentChild, Input, ViewEncapsulation } from '@angular/core';
import { NavbarLogoDirective } from '../../directives/navbar-logo.directive';
import { AsyncPipe, NgTemplateOutlet } from '@angular/common';
import { RouterLink } from '@angular/router';
// eslint-disable-next-line @nx/enforce-module-boundaries
import { Page } from '@vet/backend';

@Component({
    // eslint-disable-next-line @angular-eslint/component-selector
    selector: 'nav[v-ui-navbar]',
    standalone: true,
    template: `
        <section class="container justify-content-between align-items-center d-flex">
            <div class="d-flex justify-content-around w-100">
                <div class="branding-container">
                    <div class="logo-container">
                        <ng-container *ngTemplateOutlet="logo.templateRef"></ng-container>
                    </div>
                </div>

                <ul class="v-ui-navbar__nav-item-list">
                    @for (headerItem of pages; track headerItem) {
                        <li>
                            <a [routerLink]="headerItem.slug">{{ headerItem.title }}</a>
                        </li>
                    }
                </ul>

                <div>
                    <a>ავტორიზაცია</a>
                    <a>რეგისტრაცია</a>
                </div>
            </div>
        </section>
    `,
    styleUrls: ['./navbar.component.scss'],
    encapsulation: ViewEncapsulation.None,
    imports: [NgTemplateOutlet, AsyncPipe, RouterLink],
})
export class NavbarComponent {
    @ContentChild(NavbarLogoDirective)
    logo!: NavbarLogoDirective;

    @Input()
    pages: Page[] = [];
}
