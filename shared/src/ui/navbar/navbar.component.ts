import { Component, computed, ElementRef, HostListener, inject, input, output, signal } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import type { NavbarMenuItemType } from './navbar-menu-item.type';
import { KENDO_ICONS } from '@progress/kendo-angular-icons';
import { User } from '@vet/backend';
import { KENDO_BUTTON } from '@progress/kendo-angular-buttons';
import { TranslocoPipe, TranslocoService } from '@jsverse/transloco';
import { kendoIcons, vetIcons } from '../../shared.icons';
import { Citizenship } from '../../shared.enums';
import { UserAccount, UserRolesService } from '@vet/auth';

@Component({
  selector: 'vet-ui-navbar',
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.scss',
  imports: [RouterLink, KENDO_ICONS, KENDO_BUTTON, TranslocoPipe],
})
export class NavbarComponent {
  pages = input.required<NavbarMenuItemType[]>();
  user = input.required<User | null>();

  protected readonly userRolesService = inject(UserRolesService);
  protected readonly selectedAccountName = computed(() => this.userRolesService.selectedAccountName());
  protected readonly userAccounts = computed(() =>
    this.userRolesService.userAccounts().sort((a) => {
      return a.name === this.selectedAccountName() ? -1 : 1;
    }),
  );

  logout = output<void>();

  router = inject(Router);
  elementRef = inject(ElementRef);
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
    return this.transloco.getActiveLang() === 'ka' ? Citizenship.Georgian : 'ENG';
  }

  toggleProfileCard(): void {
    this.isProfileCardOpen.set(!this.isProfileCardOpen());
  }

  toggleMobileMenu(): void {
    this.isMobileMenuOpen.set(!this.isMobileMenuOpen());
    this.isProfileCardOpen.set(false);
  }

  navigateTo(direction: string) {
    this.isMobileMenuOpen.set(false);
    this.isProfileCardOpen.set(false);
    this.router.navigate([`/${direction}`]).then();
  }

  switchLang(): void {
    const activeLang = this.transloco.getActiveLang();
    const newLang = activeLang === 'ka' ? 'en' : 'ka';
    this.transloco.setActiveLang(newLang);
  }

  handleLogout(): void {
    this.isMobileMenuOpen.set(false);
    this.isProfileCardOpen.set(false);
    this.logout.emit();
    void this.router.navigate(['authorization']);
  }

  onUserAccountClick(userAccount: UserAccount) {
    if (this.userRolesService.selectedAccountName() === userAccount.name) {
      void this.router.navigate(['user-profile/overview']);
    } else if (userAccount.name) {
      this.userRolesService.selectUserAccount(userAccount.name);
      this.isMobileMenuOpen.set(false);
      this.isProfileCardOpen.set(false);
    }
  }
}
