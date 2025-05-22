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

const ACCESS_TOKEN_STORAGE_KEY = '__user_tokens__';
const REFRESH_TOKEN_STORAGE_KEY = '__user_tokens_refresh__';

const _authSkipCtx = useHttpContexts(skipAuthorizationCtx());

@Injectable({
  providedIn: 'root',
})
export class AuthenticationService {
  private readonly _authService = inject(AuthService);
  private readonly _ssrCookieService = inject(SsrCookieService);

  private readonly _accessToken = signal(this._ssrCookieService.get(ACCESS_TOKEN_STORAGE_KEY) || null);
  private readonly _refreshToken = signal(this._ssrCookieService.get(REFRESH_TOKEN_STORAGE_KEY) || null);
  private readonly twoFactorToken = signal('');

  readonly isAuthenticated = computed(() => !!this.user());
  readonly user = computed(() => this._user.value() || null);
  readonly accessToken = computed(() => this._accessToken() || '');
  readonly isLoading = computed(() => this._user.isLoading());

  private readonly _user = rxResource({
    request: () => this._accessToken(),
    loader: ({ request: accessToken }) => {
      if (!accessToken) {
        return of(undefined);
      }
      return this._authService.getUser().pipe(map(({ data }) => data));
    },
  });

  constructor() {
    effect(() => {
      this._ssrCookieService.set(ACCESS_TOKEN_STORAGE_KEY, this._accessToken() || '');
      this._ssrCookieService.set(REFRESH_TOKEN_STORAGE_KEY, this._refreshToken() || '');
    });
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
    this._ssrCookieService.deleteAll();
  }

  private handleSuccessfulAuthorization(userOr2Fa: UserLoginResponseBody): UserLoginResponseBody {
    this._accessToken.set(userOr2Fa.access_token);
    this._refreshToken.set(userOr2Fa.refresh_token);
    this.twoFactorToken.set('');
    return userOr2Fa;
  }
}
