import { Component, ContentChild, ViewEncapsulation } from '@angular/core';
import { NavbarLogoDirective } from '../../directives/navbar-logo.directive';
import { NgTemplateOutlet } from '@angular/common';

@Component({
    // eslint-disable-next-line @angular-eslint/component-selector
    selector: 'nav[v-ui-navbar]',
    standalone: true,
    template: `
        <section class="container justify-content-between align-items-center d-flex">
            <div class="branding-container">
                <div class="logo-container">
                    <ng-container *ngTemplateOutlet="logo.templateRef"></ng-container>
                </div>
            </div>
        </section>
    `,
    styleUrls: ['./navbar.component.scss'],
    encapsulation: ViewEncapsulation.None,
    imports: [NgTemplateOutlet],
})
export class NavbarComponent {
    @ContentChild(NavbarLogoDirective)
    logo!: NavbarLogoDirective;
}
