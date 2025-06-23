import { computed, effect, inject, Injectable, signal } from '@angular/core';
import { AuthenticationService } from './authentication.service';
import { rxResource } from '@angular/core/rxjs-interop';
import { RolesService } from '@vet/backend';
import { finalize, map, Observable, of, tap } from 'rxjs';
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
  readonly organisation = computed(() => {
    const account = this.selectedAccount();
    return account?.organisation ?? null;
  });
  readonly isUserAccountsLoaded = signal(false);

  private readonly _cookieService = inject(SsrCookieService);
  private readonly _authenticationService = inject(AuthenticationService);
  private readonly _rolesService = inject(RolesService);
  private readonly _userAccounts = rxResource({
    request: () => ({
      isAuthenticated: this._authenticationService.isAuthenticated()
    }),
    loader: ({ request: { isAuthenticated } }): Observable<UserAccount[]> => {
      const setLoaded = () => this.isUserAccountsLoaded.set(true);

      if (!isAuthenticated) {
        setLoaded();
        return of([]);
      }

      return this._rolesService.roles().pipe(
        map((roles) => roles as UserAccount[]),
        tap((accounts) => {
          const firstAccount = accounts?.[0];
          if (firstAccount?.name && firstAccount.name !== this._savedAccountName()) {
            this._cookieService.set(USER_SELECTED_ACCOUNT_NAME, firstAccount.name, undefined, '/');
            this._savedAccountName.set(firstAccount.name);
          }
        }),
        finalize(setLoaded)
      );
    },
  });
  private readonly _savedAccountName = signal(this._cookieService.get(USER_SELECTED_ACCOUNT_NAME) ?? null);

  constructor() {
    effect(() => {
      this._cookieService.set(USER_SELECTED_ACCOUNT_NAME, this._savedAccountName(), undefined, '/');
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
