import { Component, ContentChild, Input, ViewEncapsulation } from '@angular/core';
import { NavbarLogoDirective } from '../../directives/navbar-logo.directive';
import { NgIf, NgTemplateOutlet } from '@angular/common';
import { RouterLink } from '@angular/router';
import { NavbarMenuComponent } from '../../../navbar-menu/navbar-menu/navbar-menu.component';
import { NavbarMenuItemType } from '../../../navbar-menu/navbar-menu-item/navbar-menu-item.type';
import { SvgIconComponent } from 'angular-svg-icon';
import { ButtonComponent } from '../../../button/button/button.component';

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

            <v-ui-navbar-menu [navbarMenuItems]="pages"></v-ui-navbar-menu>

            <div class="d-flex align-items-center justify-content-between gap-4">
                <svg-icon class="v-ui-navbar__svg-icon" src="assets/icons/search.svg"></svg-icon>
                <svg-icon class="v-ui-navbar__svg-icon" src="assets/icons/globe.svg"></svg-icon>

                <a class="v-ui-navbar__link" routerLink="authentication">ავტორიზაცია</a>
                <button v-ui-button color="secondary">
                    <a class="v-ui-navbar__link v-ui-navbar__link-blue" routerLink="registration">რეგისტრაცია</a>
                </button>
            </div>
        </section>
    `,
    styleUrls: ['./navbar.component.scss'],
    encapsulation: ViewEncapsulation.None,
    imports: [NgTemplateOutlet, NgIf, RouterLink, NavbarMenuComponent, SvgIconComponent, ButtonComponent],
})
export class NavbarComponent {
    @ContentChild(NavbarLogoDirective)
    logo!: NavbarLogoDirective;

    @Input() pages!: NavbarMenuItemType[];
}
