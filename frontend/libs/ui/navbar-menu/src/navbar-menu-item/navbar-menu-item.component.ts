import { Component, computed, input, ViewEncapsulation } from '@angular/core';
import { RouterLink } from '@angular/router';
import { NavbarMenuItemType } from './navbar-menu-item.type';

@Component({
    // eslint-disable-next-line @angular-eslint/component-selector
    selector: 'li[v-ui-navbar-menu-item]',
    standalone: true,
    template: `
        <a class="v-ui-navbar-menu-item__slug" [class.font-bold]="hasChildren()" [routerLink]="routeLink()">
            {{ navbarItem().title }}
        </a>

        @if (hasChildren()) {
            <ul class="v-ui-navbar-menu-item__list">
                @for (child of navbarItem().children; track child; let idx = $index) {
                    <li class="v-ui-navbar-menu-item__list-item" v-ui-navbar-menu-item [navbarItem]="child"></li>
                }
            </ul>
        }
    `,
    styleUrls: ['./navbar-menu-item.component.scss'],
    encapsulation: ViewEncapsulation.None,
    imports: [RouterLink],
})
export class NavbarMenuItemComponent {
    navbarItem = input.required<NavbarMenuItemType>();
    routeLink = computed(() => '/' + this.navbarItem().url.join('/'));
    hasChildren = computed(() => {
        const children = this.navbarItem().children;
        return children && children.length > 0;
    });
}
