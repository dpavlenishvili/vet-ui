import { computed, effect, inject, Injectable, signal } from '@angular/core';
import { AuthenticationService } from './authentication.service';
import { rxResource } from '@angular/core/rxjs-interop';
import { RolesService } from '@vet/backend';
import { finalize, Observable, of } from 'rxjs';
import { SsrCookieService } from 'ngx-cookie-service-ssr';
import { AuthPermission, AuthRole, UserAccount } from './auth.types';
import { AccessControl } from './access-control';
import { evaluateAccessControl } from './access-control/access-control.evaluate';

const USER_SELECTED_ACCOUNT_NAME = 'USER_SELECTED_ACCOUNT';
const DEFAULT_ROLE = 'Default User';

@Injectable({
  providedIn: 'root',
})
export class UserRolesService {
  readonly selectedAccount = computed((): UserAccount | null => {
    const savedAccountName = this._savedAccountName();
    let selectedAccount = this.userAccounts().find((account) => account.name === savedAccountName);

    if (!selectedAccount) {
      selectedAccount = this.userAccounts()[0];
    }

    if (!selectedAccount) {
      return null;
    }

    return {
      ...selectedAccount,
      roles: [...(selectedAccount.roles ?? []), ...(selectedAccount.organisation ? ['Organisation' as AuthRole] : [])],
      permissions: selectedAccount.permissions ?? [],
    };
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
      isUserLoaded: this._authenticationService.isReady(),
      isAuthenticated: this._authenticationService.isAuthenticated(),
    }),
    loader: ({ request: { isUserLoaded, isAuthenticated } }): Observable<UserAccount[]> => {
      if (!isUserLoaded) {
        return of([]);
      }

      if (isAuthenticated) {
        return this._rolesService.roles().pipe(
          finalize(() => {
            this.isUserAccountsLoaded.set(true);
          }),
        ) as unknown as Observable<UserAccount[]>;
      }

      this.isUserAccountsLoaded.set(true);
      return of([]);
    },
  });
  private readonly _savedAccountName = signal(this._cookieService.get(USER_SELECTED_ACCOUNT_NAME) ?? null);

  constructor() {
    effect(() => {
      this._cookieService.set(USER_SELECTED_ACCOUNT_NAME, this._savedAccountName(), undefined, '/');
    });
  }

  get accountRoles() {
    const roles: AuthRole[] = this.selectedAccount()?.roles ?? [];

    if (this.selectedAccount()?.organisation) {
      roles.push('Organisation');
    }

    return roles;
  }

  get accountPermissions() {
    return this.selectedAccount()?.permissions ?? [];
  }

  hasRole(role: AuthRole) {
    return this.accountRoles.includes(role);
  }

  can(permission: AuthPermission) {
    return this.accountPermissions.includes(permission);
  }

  hasAccess<T extends AccessControl>(control: T | null | undefined) {
    if (!control) {
      return true;
    }

    return evaluateAccessControl(control, {
      isAuthenticated: this._authenticationService.isAuthenticated(),
      roles: this.accountRoles,
      permissions: this.accountPermissions,
    })
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
