import { Component, input, ViewEncapsulation } from '@angular/core';
import { RouterLink } from '@angular/router';
import { NavbarMenuItemType } from './navbar-menu-item.type';
import { KENDO_ICONS } from '@progress/kendo-angular-icons';

@Component({
  selector: 'vet-ui-navbar',
  template: `
    <nav class="v-ui-navbar">
      <div class="v-ui-navbar__container">
        <div class="v-ui-navbar__logo">
          <ng-content select="[navbar-logo]"></ng-content>
        </div>

        <ul class="v-ui-navbar__menu">
          @for (item of pages(); track item.url) {
            <li class="v-ui-navbar__menu-item">
              <a [routerLink]="item.url" class="v-ui-navbar__menu-link">
                {{ item.title }}
              </a>
            </li>
          }
        </ul>

        <div class="v-ui-navbar__actions">
          <kendo-icon name="search"></kendo-icon>
          <a class="v-ui-navbar__link">ENG</a>
          <ng-content select="[auth-content]"></ng-content>
        </div>
      </div>
    </nav>
  `,
  styleUrls: ['./navbar.component.scss'],
  encapsulation: ViewEncapsulation.None,
  imports: [RouterLink, KENDO_ICONS],
  standalone: true
})
export class NavbarComponent {
  pages = input<NavbarMenuItemType[]>([]);
}
