import { NgIf, NgTemplateOutlet } from '@angular/common';
import { Component, ContentChild, Input, ViewEncapsulation } from '@angular/core';
import { RouterLink } from '@angular/router';
import { SvgIconComponent } from 'angular-svg-icon';

import { ButtonComponent } from '../button/button.component';

import { NavbarLogoDirective } from './navbar-logo.directive';
import { NavbarMenuItemType } from './navbar-menu-item/navbar-menu-item.type';
import { NavbarMenuComponent } from './navbar-menu/navbar-menu.component';

@Component({
  selector: 'nav[vet-navbar]',
  standalone: true,
  template: ``,
  styleUrls: ['./navbar.component.scss'],
  encapsulation: ViewEncapsulation.None,
  imports: [
    NgTemplateOutlet,
    NgIf,
    RouterLink,
    NavbarMenuComponent,
    SvgIconComponent,
    ButtonComponent,
  ],
})
export class NavbarComponent {
  @ContentChild(NavbarLogoDirective)
  logo!: NavbarLogoDirective;

  @Input() pages!: NavbarMenuItemType[];
}
