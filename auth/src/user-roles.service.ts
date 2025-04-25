import { computed, effect, inject, Injectable, signal } from '@angular/core';
import { AuthenticationService } from './authentication.service';
import { rxResource } from '@angular/core/rxjs-interop';
import { RolesService } from '@vet/backend';
import { Observable, of } from 'rxjs';
import { SsrCookieService } from 'ngx-cookie-service-ssr';
import { AuthPermission, AuthRole, UserAccount } from './auth.types';

const USER_SELECTED_ACCOUNT_NAME = 'USER_SELECTED_ACCOUNT';
const DEFAULT_ROLE = 'Default User';

@Injectable({
  providedIn: 'root',
})
export class UserRolesService {
  readonly selectedAccount = computed((): UserAccount | null => {
    const savedAccountName = this._savedAccountName();
    const selectedAccount = this.userAccounts().find((account) => account.name === savedAccountName);

    return selectedAccount ?? null;
  });
  readonly selectedAccountName = computed(() => this.selectedAccount()?.name ?? null);
  readonly selectedRole = computed((): AuthRole => this.selectedAccount()?.roles?.[0] ?? DEFAULT_ROLE);
  readonly userAccounts = computed((): UserAccount[] => this._userAccounts.value() ?? []);
  readonly currentAccountName = computed(() => this._savedAccountName());

  private readonly _cookieService = inject(SsrCookieService);
  private readonly _authenticationService = inject(AuthenticationService);
  private readonly _rolesService = inject(RolesService);
  private readonly _userAccounts = rxResource({
    request: () => this._authenticationService.isAuthenticated(),
    loader: ({ request: isAuthenticated }): Observable<UserAccount[]> => {
      if (isAuthenticated) {
        return this._rolesService.roles() as unknown as Observable<UserAccount[]>;
      }
      return of([]);
    },
  });
  private readonly _savedAccountName = signal(this._cookieService.get(USER_SELECTED_ACCOUNT_NAME) ?? null);

  constructor() {
    effect(() => {
      this._cookieService.set(USER_SELECTED_ACCOUNT_NAME, this._savedAccountName());
    });
  }

  hasRole(role: AuthRole) {
    return !!this.selectedAccount()?.roles?.includes(role);
  }

  can(permission: AuthPermission) {
    return !!this.selectedAccount()?.permissions?.includes(permission);
  }

  selectUserAccount(accountName: string) {
    if (this.userAccounts().find((account) => account.name === accountName)) {
      this._savedAccountName.set(accountName);
    }
  }

  getOrganisation() {
    return this.selectedAccount()?.organisation;
  }
}
