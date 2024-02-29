import { Component, Input, ViewEncapsulation } from '@angular/core';
import { RouterLink } from '@angular/router';
import { NavbarMenuItemComponent } from '../navbar-menu-item/navbar-menu-item.component';
import { NavbarMenuItemType } from '../navbar-menu-item/navbar-menu-item.type';

@Component({
    selector: 'v-ui-navbar-menu',
    standalone: true,
    template: `
        <ul class="v-ui-navbar-menu__items-list">
            @for (navbarItem of navbarMenuItems; track navbarItem; let last = $last) {
                <li v-ui-navbar-menu-item [navbarItem]="navbarItem"></li>

                @if (!last) {
                    <span class="v-ui-navbar-menu__list-item-separator" aria-hidden="true"></span>
                }
            }
        </ul>
    `,
    styleUrls: ['./navbar-menu.component.scss'],
    encapsulation: ViewEncapsulation.None,
    imports: [RouterLink, NavbarMenuItemComponent],
})
export class NavbarMenuComponent {
    @Input() navbarMenuItems!: NavbarMenuItemType[];
}
