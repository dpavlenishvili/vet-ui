import { Component, inject, Input, ViewEncapsulation } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import type { NavbarMenuItemType } from './navbar-menu-item.type';
import { KENDO_ICONS } from '@progress/kendo-angular-icons';
import { CustomAuthService } from '@vet/auth';
import { RolesService } from '@vet/backend';
import * as kendoIcons from '@progress/kendo-svg-icons';
import { KENDO_BUTTON } from '@progress/kendo-angular-buttons';
import { TranslocoPipe, TranslocoService } from '@jsverse/transloco';

@Component({
  selector: 'vet-ui-navbar',
  standalone: true,
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss'],
  encapsulation: ViewEncapsulation.None,
  imports: [RouterLink, KENDO_ICONS, KENDO_BUTTON, TranslocoPipe],
})
export class NavbarComponent {
  @Input() pages!: NavbarMenuItemType[];
  @Input() avatarUrl: string | null = null;

  customAuthService = inject(CustomAuthService);
  rolesService = inject(RolesService);
  router = inject(Router);

  tokenUser$ = inject(CustomAuthService).tokenUser$;

  kendoIcons = kendoIcons;

  isProfileCardOpen = false;

  private transloco = inject(TranslocoService);

  get currentLangLabel(): string {
    const activeLang = this.transloco.getActiveLang();
    return activeLang === 'ka' ? 'GEO' : 'ENG';
  }

  toggleProfileCard(): void {
    this.isProfileCardOpen = !this.isProfileCardOpen;
  }

  navigateTo(direction: string) {
    this.router.navigate([`/${direction}`]).then();
  }

  switchLang(): void {
    const activeLang = this.transloco.getActiveLang();
    const newLang = activeLang === 'ka' ? 'en' : 'ka';
    this.transloco.setActiveLang(newLang);
  }

  logout(): void {
    this.isProfileCardOpen = false;
    this.customAuthService.logout().subscribe();
  }
}
