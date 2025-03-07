import {
  Component,
  ElementRef,
  HostListener,
  inject,
  Input,
  OnInit,
  signal,
  ViewEncapsulation,
  WritableSignal,
} from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import type { NavbarMenuItemType } from './navbar-menu-item.type';
import { KENDO_ICONS } from '@progress/kendo-angular-icons';
import { CustomAuthService } from '@vet/auth';
import { RolesService } from '@vet/backend';
import { KENDO_BUTTON } from '@progress/kendo-angular-buttons';
import { TranslocoPipe, TranslocoService } from '@jsverse/transloco';
import { AsyncPipe } from '@angular/common';
import { kendoIcons, vetIcons } from '../../shared.icons';
import { tap } from 'rxjs';

@Component({
  selector: 'vet-ui-navbar',
  standalone: true,
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss'],
  encapsulation: ViewEncapsulation.None,
  imports: [RouterLink, KENDO_ICONS, KENDO_BUTTON, TranslocoPipe, AsyncPipe],
})
export class NavbarComponent implements OnInit {
  @Input() pages!: NavbarMenuItemType[];
  @Input() avatarUrl: string | null = null;

  customAuthService = inject(CustomAuthService);
  rolesService = inject(RolesService);
  router = inject(Router);
  elementRef = inject(ElementRef);
  tokenUser$ = inject(CustomAuthService).tokenUser$;
  transloco = inject(TranslocoService);
  kendoIcons = kendoIcons;
  isProfileCardOpen = signal(false);
  isMobileMenuOpen = signal(false);

  vetIcons = vetIcons;
  roles = signal<
    | {
    name?: string;
    roles?: string[];
    organisation?: string;
    permissions?: string[];
  }[]
    | null
  >(null);

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
    this.customAuthService.logout().subscribe();
  }

  ngOnInit(): void {
    if (this.tokenUser$()) {
      this.rolesService
        .roles()
        .pipe(
          tap((res) => {
            this.roles.set(res);
            const userRole = res?.[0].roles?.[0];
            if (userRole) {
              this.customAuthService.userRole$.set(userRole);
            }
          }),
        )
        .subscribe();
    }
  }
}
