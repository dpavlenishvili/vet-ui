import { Component, ElementRef, HostListener, inject, input, signal, ViewEncapsulation } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import type { NavbarMenuItemType } from './navbar-menu-item.type';
import { KENDO_ICONS } from '@progress/kendo-angular-icons';
import { AuthenticationService, UserRolesService } from '@vet/auth';
import { KENDO_BUTTON } from '@progress/kendo-angular-buttons';
import { TranslocoPipe, TranslocoService } from '@jsverse/transloco';
import { kendoIcons, vetIcons } from '../../shared.icons';

@Component({
  selector: 'vet-ui-navbar',
  standalone: true,
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss'],
  encapsulation: ViewEncapsulation.None,
  imports: [RouterLink, KENDO_ICONS, KENDO_BUTTON, TranslocoPipe],
})
export class NavbarComponent {
  pages = input.required<NavbarMenuItemType[]>();

  authenticationService = inject(AuthenticationService);
  userRolesService = inject(UserRolesService);
  roles = this.userRolesService.roles;
  router = inject(Router);
  elementRef = inject(ElementRef);
  user = this.authenticationService.user;
  transloco = inject(TranslocoService);
  kendoIcons = kendoIcons;
  isProfileCardOpen = signal(false);
  isMobileMenuOpen = signal(false);

  vetIcons = vetIcons;

  @HostListener('document:click', ['$event'])
  onClickOutside(event: Event): void {
    if (this.isProfileCardOpen() && !this.elementRef.nativeElement.contains(event.target)) {
      this.isProfileCardOpen.set(false);
    }
  }

  get currentLangLabel(): string {
    const activeLang = this.transloco.getActiveLang();
    return activeLang === 'ka' ? 'GEO' : 'ENG';
  }

  toggleProfileCard(): void {
    this.isProfileCardOpen.set(!this.isProfileCardOpen());
  }

  toggleMobileMenu(): void {
    this.isMobileMenuOpen.set(!this.isMobileMenuOpen());
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
    this.isProfileCardOpen.set(false);
    this.authenticationService.logout().subscribe();
  }
}
