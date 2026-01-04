import { Component, computed, ElementRef, HostListener, inject, input, output, signal } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { KENDO_ICONS } from '@progress/kendo-angular-icons';
import { Page, User } from '@vet/backend';
import { KENDO_BUTTON } from '@progress/kendo-angular-buttons';
import { TranslocoPipe, TranslocoService } from '@jsverse/transloco';
import { kendoIcons, vetIcons } from '../../shared.icons';
import { Citizenship } from '../../shared.enums';
import { AuthenticationService, UserAccount, UserRolesService } from '@vet/auth';
import { IconComponent } from '../../components/icon';

@Component({
  selector: 'vet-ui-navbar',
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.scss',
  imports: [RouterLink, KENDO_ICONS, KENDO_BUTTON, TranslocoPipe, IconComponent],
})
export class NavbarComponent {
  pages = input.required<Page[]>();
  user = input.required<User | null>();

  headerPages = computed(() => {
    return this.pages().filter((page) => {
      return page.menus?.some((menu) => {
        const lcName = menu.name.toLowerCase();

        return lcName.includes('top');
      });
    });
  });

  protected readonly userRolesService = inject(UserRolesService);
  protected readonly selectedAccountName = computed(() => this.userRolesService.selectedAccountName());
  protected readonly userAccounts = computed(() =>
    this.userRolesService.userAccounts().sort((a) => {
      return a.name === this.selectedAccountName() ? -1 : 1;
    }),
  );
  protected readonly isCompactNav = computed(() => this.headerPages().length >= 6);

  logout = output<void>();

  router = inject(Router);
  elementRef = inject(ElementRef);
  transloco = inject(TranslocoService);
  kendoIcons = kendoIcons;
  isProfileCardOpen = signal(false);
  isMobileMenuOpen = signal(false);
  mobileOpenSubmenus = signal<Set<string>>(new Set());

  vetIcons = vetIcons;
  private readonly _authenticationService = inject(AuthenticationService);
  protected readonly isAuthReady = this._authenticationService.isReady;
  protected readonly isAuthUiReady = computed(
    () =>
      this.isAuthReady() &&
      this.userRolesService.isUserAccountsLoaded() &&
      !this._authenticationService.isLoadingUser(),
  );

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
    this.mobileOpenSubmenus.set(new Set());
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

  handleLoginClick(event: Event): void {
    event.preventDefault();
    this.isMobileMenuOpen.set(false);
    this._authenticationService.initiateLogin();
  }

  handleLogout(): void {
    this.isMobileMenuOpen.set(false);
    this.isProfileCardOpen.set(false);
    this.logout.emit();
    this._authenticationService.logout();
  }

  onUserAccountClick(userAccount: UserAccount) {
    if (this.userRolesService.selectedAccountName() === userAccount.name) {
      void this.router.navigate(['user-profile/overview']);
    } else if (userAccount.name) {
      this.userRolesService.selectUserAccount(userAccount.name);
      this.isMobileMenuOpen.set(false);
      this.isProfileCardOpen.set(false);
      void this.router.navigate(['']);
    }
  }

  hasChildren(page: Page): boolean {
    return !!page.children && page.children.length > 0;
  }

  isMobileSubmenuOpen(slug: string | null | undefined): boolean {
    if (!slug) {
      return false;
    }
    return this.mobileOpenSubmenus().has(slug);
  }

  toggleMobileSubmenu(slug: string | null | undefined): void {
    if (!slug) {
      return;
    }
    const next = new Set(this.mobileOpenSubmenus());
    if (next.has(slug)) {
      next.delete(slug);
    } else {
      next.add(slug);
    }
    this.mobileOpenSubmenus.set(next);
  }
}
