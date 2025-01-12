import { Component, Input, ViewEncapsulation } from '@angular/core';
import { RouterLink } from '@angular/router';
import { NgForOf } from '@angular/common';
import { NavbarMenuItemType } from './navbar-menu-item.type';
import { KENDO_ICONS } from '@progress/kendo-angular-icons';

@Component({
  // eslint-disable-next-line @angular-eslint/component-selector
  selector: 'v-ui-navbar',
  template: `
    <nav class="v-ui-navbar">
      <div class="v-ui-navbar__container">
        <!-- Logo Section -->
        <div class="v-ui-navbar__logo">
          <ng-content select="[navbar-logo]"></ng-content>
        </div>

        <!-- Navigation Links -->
        <ul class="v-ui-navbar__menu">
          <li class="v-ui-navbar__menu-item" *ngFor="let item of pages">
            <a [routerLink]="item.url" class="v-ui-navbar__menu-link">{{ item.title }}</a>
          </li>
        </ul>

        <!-- Actions Section -->
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
  imports: [RouterLink, NgForOf, KENDO_ICONS],
})
export class NavbarComponent {
  @Input() pages!: NavbarMenuItemType[];
}
