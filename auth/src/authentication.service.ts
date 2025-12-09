import { computed, effect, inject, Injectable, Injector, signal } from '@angular/core';
import { AuthService } from '@vet/backend';
import { rxResource } from '@angular/core/rxjs-interop';
import { map, of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { useAuthEnvironment } from './auth.providers';
import Keycloak from 'keycloak-js';
import { UserRolesService } from './user-roles.service';

@Injectable({
  providedIn: 'root',
})
export class AuthenticationService {
  private readonly _authService = inject(AuthService);
  private readonly _environment = useAuthEnvironment();
  private readonly _keycloak = inject<Keycloak>(Keycloak);

  private readonly _isInitialized = signal(false);

  private readonly _userResource = rxResource({
    request: () => ({
      token: this._keycloak.token,
      isInitialized: this._isInitialized(),
      authenticated: this._keycloak.authenticated,
    }),
    defaultValue: null,
    loader: ({ request: { token, authenticated } }) => {
      if (!token || !authenticated) {
        return of(null);
      }

      return this._authService.getUser().pipe(
        map((response) => response.data ?? null),
        catchError(() => {
          return of(null);
        }),
      );
    },
  });

  readonly isReady = this._isInitialized.asReadonly();
  readonly user = computed(() => this._userResource.value());
  readonly isAuthenticated = computed(() => this._keycloak.authenticated && !!this.user());
  readonly isLoadingUser = computed(() => this._userResource.isLoading());
  readonly hasTokens = computed(() => !!this._keycloak.token && this._keycloak.authenticated);
  readonly isMandatoryFieldsFilled = computed(() => {
    const user = this.user();
    const isLoading = this.isLoadingUser();

    if (isLoading) return null;

    if (!user) return false;

    return !!(user.address && user.region && user.district);
  });

  constructor() {
    effect(() => {
      if (this._keycloak.didInitialize) {
        this._isInitialized.set(true);
      }
    });

    effect(() => {
      if (this._keycloak.authenticated && this._keycloak.token) {
        this._userResource.reload();
      }
    });
  }

  initiateLogin(): void {
    void this._keycloak.login();
  }

  private readonly _injector = inject(Injector);

  logout() {
    const postLogoutRedirectUri =
      this._environment.keycloak.postLogoutRedirectUri || this._environment.keycloak.redirectUri;

    // Clear user data before logout
    const userRolesService = this._injector.get(UserRolesService);
    userRolesService.clearUserData();

    void this._keycloak.logout({ redirectUri: postLogoutRedirectUri });
  }

  reloadUser(): void {
    if (this._keycloak.authenticated && this._keycloak.token) {
      this._userResource.reload();
    }
  }
}
