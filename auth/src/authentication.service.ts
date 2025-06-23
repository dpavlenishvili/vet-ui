import { computed, effect, inject, Injectable, signal } from '@angular/core';
import {
  AuthService,
  type UserLogin2FaResponseBody,
  UserLoginResponseBody,
  ValidateCodeRequestBody,
} from '@vet/backend';
import { SsrCookieService } from 'ngx-cookie-service-ssr';
import { rxResource } from '@angular/core/rxjs-interop';
import { finalize, map, Observable, of, tap, throwError } from 'rxjs';
import { HttpErrorResponse, HttpStatusCode } from '@angular/common/http';
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

  private readonly _remember = signal(false);
  private readonly _accessToken = signal('');
  private readonly _refreshToken = signal('');
  private readonly twoFactorToken = signal('');

  readonly isAuthenticated = computed(() => !!this.user());
  readonly user = computed(() => this._user.value() || null);
  readonly accessToken = computed(() => this._accessToken() || '');
  readonly isLoading = computed(() => this._user.isLoading());
  readonly isAccessTokenLoaded = signal(false);
  readonly isUserLoaded = signal(false);
  readonly isForceRefresh = signal(false);

  private readonly _user = rxResource({
    request: () => ({
      accessToken: this._accessToken(),
      isAccessTokenLoaded: this.isAccessTokenLoaded(),
    }),
    loader: ({ request: { accessToken, isAccessTokenLoaded } }) => {
      if (!accessToken) {
        if (isAccessTokenLoaded) {
          this.isUserLoaded.set(true);
        }

        return of(undefined);
      }

      return this._authService.getUser().pipe(
        map(({ data }) => data),
        tap(() => this.isUserLoaded.set(true)),
      );
    },
  });

  constructor() {
    effect(() => {
      const cookies = this._ssrCookieService.getAll();
      const remember = cookies[REMEMBER_TOKEN] === 'true';
      const accessToken = cookies[ACCESS_TOKEN_STORAGE_KEY] ?? '';
      const refreshToken = cookies[REFRESH_TOKEN_STORAGE_KEY] ?? '';
      this._remember.set(remember);
      this._accessToken.set(accessToken);
      this._refreshToken.set(refreshToken);
      this.isAccessTokenLoaded.set(true);

      if (refreshToken && !this.isForceRefresh() && location.search.includes('refresh=force')) {
        this.isForceRefresh.set(true);
        this.refreshToken().subscribe();
      }
    });
  }

  setRemember(remember: boolean) {
    this._remember.set(remember);
    this._ssrCookieService.set(REMEMBER_TOKEN, remember ? 'true' : 'false', undefined, '/');
  }

  login(request: { pid: string; password: string }): Observable<UserLoginResponseBody> {
    return this._authService.loginUser(request, { context: _authSkipCtx }).pipe(
      map((userOr2Fa) => {
        this.twoFactorToken.set((userOr2Fa as UserLogin2FaResponseBody).token);
        if ('access_token' in userOr2Fa) {
          return this.handleSuccessfulAuthorization(userOr2Fa);
        }
        throw new HttpErrorResponse({
          status: HttpStatusCode.Forbidden,
          error: userOr2Fa,
        });
      }),
    );
  }

  logout(): Observable<void> {
    return this._authService.logoutUser().pipe(
      finalize(() => {
        this._ssrCookieService.delete(REMEMBER_TOKEN);
        this.clearTokens();
      }),
      map(() => undefined),
    );
  }

  validate2FaCode(req: ValidateCodeRequestBody): Observable<UserLoginResponseBody> {
    if (!req.token) {
      req.token = this.twoFactorToken();
    }
    return this._authService
      .validate2FaCode(req, { context: _authSkipCtx })
      .pipe(tap((user) => this.handleSuccessfulAuthorization(user)));
  }

  refreshToken(): Observable<null> {
    const refreshToken = this._refreshToken();

    if (!refreshToken) {
      return of(null);
    }

    return this._authService
      .refreshToken(
        {
          refresh_token: refreshToken,
        },
        { context: _authSkipCtx },
      )
      .pipe(
        tap((data) => this.handleSuccessfulAuthorization(data)),
        map(() => null),
        catchError((err: HttpErrorResponse) => {
          this.clearTokens();
          return throwError(() => err);
        }),
      );
  }

  reloadUser(): void {
    this._user.reload();
  }

  clearTokens(): void {
    this._accessToken.set('');
    this._refreshToken.set('');
    this.twoFactorToken.set('');
    this._ssrCookieService.delete(ACCESS_TOKEN_STORAGE_KEY);
    this._ssrCookieService.delete(REFRESH_TOKEN_STORAGE_KEY);
  }

  private handleSuccessfulAuthorization(userOr2Fa: UserLoginResponseBody): UserLoginResponseBody {
    const shouldRemember = this._ssrCookieService.get(REMEMBER_TOKEN);
    const ttl = this._environment.authDataTtlInSeconds * 1000;
    const now = Date.now();
    const expiresAt = shouldRemember ? new Date(now + ttl) : undefined;
    this._accessToken.set(userOr2Fa.access_token);
    this._refreshToken.set(userOr2Fa.refresh_token);
    this.twoFactorToken.set('');

    this._ssrCookieService.delete(ACCESS_TOKEN_STORAGE_KEY);
    this._ssrCookieService.delete(REFRESH_TOKEN_STORAGE_KEY);
    this._ssrCookieService.set(ACCESS_TOKEN_STORAGE_KEY, userOr2Fa.access_token, expiresAt, '/');
    this._ssrCookieService.set(REFRESH_TOKEN_STORAGE_KEY, userOr2Fa.refresh_token, expiresAt, '/');

    return userOr2Fa;
  }
}
