import { computed, effect, inject, Injectable, signal } from '@angular/core';
import {
  AuthService,
  type UserLogin2FaResponseBody,
  UserLoginResponseBody,
  ValidateCodeRequestBody,
} from '@vet/backend';
import { SsrCookieService } from 'ngx-cookie-service-ssr';
import { rxResource } from '@angular/core/rxjs-interop';
import { finalize, firstValueFrom, map, Observable, of, tap } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { useHttpContexts } from '@vet/shared';
import { skipAuthorizationCtx } from './skip-authorization-token-ctx';
import { useAuthEnvironment } from './auth.providers';

const REMEMBER_TOKEN = '__user_login_remember__';
const ACCESS_TOKEN_STORAGE_KEY = '__user_tokens__';
const REFRESH_TOKEN_STORAGE_KEY = '__user_tokens_refresh__';

const _authSkipCtx = useHttpContexts(skipAuthorizationCtx());

@Injectable({
  providedIn: 'root',
})
export class AuthenticationService {
  private readonly _authService = inject(AuthService);
  private readonly _ssrCookieService = inject(SsrCookieService);
  private readonly _environment = useAuthEnvironment();

  private readonly _accessToken = signal('');
  private readonly _refreshToken = signal('');
  private readonly _remember = signal(false);
  private readonly _areCookiesLoaded = signal(false);
  private readonly _isInitialized = signal(false);
  private readonly _isRefreshing = signal(false);
  private readonly _refreshPromise = signal<Promise<boolean> | null>(null);

  private readonly _userResource = rxResource({
    request: () => ({
      token: this._accessToken(),
      isInitialized: this._isInitialized(),
    }),
    defaultValue: null,
    loader: ({ request: { token } }) => {
      if (!token) {
        return of(null);
      }

      return this._authService.getUser().pipe(
        map((response) => response.data ?? null),
        catchError(() => {
          // Don't clear tokens here - let handleUnauthorized deal with it
          return of(null);
        }),
      );
    },
  });

  readonly areCookiesLoaded = this._areCookiesLoaded.asReadonly();
  readonly isReady = this._isInitialized.asReadonly();
  readonly user = computed(() => this._userResource.value());
  readonly isAuthenticated = computed(() => !!this._accessToken() && !!this.user());
  readonly isLoadingUser = computed(() => this._userResource.isLoading());
  readonly hasTokens = computed(() => !!this._accessToken());
  readonly accessToken = this._accessToken.asReadonly();
  readonly isRefreshing = this._isRefreshing.asReadonly();
  readonly remember = this._remember.asReadonly();

  constructor() {
    effect(() => {
      const cookies = this._ssrCookieService.getAll();
      const remember = cookies[REMEMBER_TOKEN] === 'true';
      const accessToken = cookies[ACCESS_TOKEN_STORAGE_KEY] ?? '';
      const refreshToken = cookies[REFRESH_TOKEN_STORAGE_KEY] ?? '';

      this._remember.set(remember);
      this._accessToken.set(accessToken);
      this._refreshToken.set(refreshToken);
      this._areCookiesLoaded.set(true);
    });

    effect(() => {
      if (!this._areCookiesLoaded()) {
        return;
      }

      const hasTokens = !!this._accessToken();
      const isLoading = this._userResource.isLoading();

      if (!hasTokens) {
        this._isInitialized.set(true);
      } else if (hasTokens && !isLoading) {
        this._isInitialized.set(true);
      }
    });
  }

  setRemember(remember: boolean) {
    this._remember.set(remember);
    this._ssrCookieService.set(REMEMBER_TOKEN, remember ? 'true' : 'false', undefined, '/');
  }

  login(request: { pid: string; password: string }): Observable<UserLoginResponseBody | UserLogin2FaResponseBody> {
    return this._authService.loginUser(request, { context: _authSkipCtx }).pipe(
      tap((response) => {
        if ('access_token' in response) {
          const loginResponse = response as UserLoginResponseBody;
          this.setTokens(loginResponse.access_token, loginResponse.refresh_token);
        }
      }),
    );
  }

  logout(): Observable<void> {
    return this._authService.logoutUser().pipe(
      finalize(() => {
        this._remember.set(false);
        this._ssrCookieService.delete(REMEMBER_TOKEN);
        this.clearTokens();
      }),
      map(() => undefined),
    );
  }

  validate2FaCode(req: ValidateCodeRequestBody): Observable<UserLoginResponseBody> {
    return this._authService.validate2FaCode(req, { context: _authSkipCtx }).pipe(
      tap((response) => {
        this.setTokens(response.access_token, response.refresh_token);
      }),
    );
  }

  clearTokens() {
    this._accessToken.set('');
    this._refreshToken.set('');
    this._ssrCookieService.delete(ACCESS_TOKEN_STORAGE_KEY);
    this._ssrCookieService.delete(REFRESH_TOKEN_STORAGE_KEY);
  }

  reloadUser(): void {
    if (this._accessToken()) {
      this._userResource.reload();
    }
  }

  async handleUnauthorized(): Promise<boolean> {
    const existingRefresh = this._refreshPromise();

    if (existingRefresh) {
      return existingRefresh;
    }

    const refreshPromise = this.refreshToken();
    this._refreshPromise.set(refreshPromise);

    try {
      return await refreshPromise;
    } finally {
      this._refreshPromise.set(null);
    }
  }

  private async refreshToken(): Promise<boolean> {
    const refreshToken = this._refreshToken();

    if (!refreshToken) {
      return false;
    }

    this._isRefreshing.set(true);

    try {
      const response = await firstValueFrom(
        this._authService.refreshToken({ refresh_token: refreshToken }, { context: _authSkipCtx }),
      );

      this.setTokens(response.access_token, response.refresh_token);
      return true;
    } catch {
      this.clearTokens();
      return false;
    } finally {
      this._isRefreshing.set(false);
    }
  }

  private setTokens(accessToken: string, refreshToken: string) {
    this._accessToken.set(accessToken);
    this._refreshToken.set(refreshToken);

    const expiresAt = this._remember()
      ? new Date(Date.now() + this._environment.authDataTtlInSeconds * 1000)
      : undefined;

    this._ssrCookieService.set(ACCESS_TOKEN_STORAGE_KEY, accessToken, expiresAt, '/');
    this._ssrCookieService.set(REFRESH_TOKEN_STORAGE_KEY, refreshToken, expiresAt, '/');
  }
}
