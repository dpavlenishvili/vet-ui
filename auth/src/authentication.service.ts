import { computed, effect, inject, Injectable, signal } from '@angular/core';
import { AuthService, UserLoginResponseBody } from '@vet/backend';
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
  readonly isAuthenticated = computed(() => !!this.user());
  readonly user = computed(() => this._user.value() || null);
  readonly accessToken = computed(() => this._accessToken() || '');
  private readonly _authService = inject(AuthService);
  private readonly _ssrCookieService = inject(SsrCookieService);

  private readonly _accessToken = signal(this._ssrCookieService.get(ACCESS_TOKEN_STORAGE_KEY) || null);
  private readonly _refreshToken = signal(this._ssrCookieService.get(REFRESH_TOKEN_STORAGE_KEY) || null);

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

  login(request: { pid: string; password: string }) {
    return this._authService.loginUser(request, { context: _authSkipCtx }).pipe(
      map((userOr2Fa) => {
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
        this._accessToken.set('');
      }),
      map(() => undefined),
    );
  }

  validate2FaCode(req: { pid: string; password: string; code: string }) {
    return this._authService
      .validate2FaCode(req, { context: _authSkipCtx })
      .pipe(tap((user) => this.handleSuccessfulAuthorization(user)));
  }

  refreshToken() {
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
          this._accessToken.set('');
          this._refreshToken.set('');
          return throwError(() => err);
        }),
      );
  }

  reloadUser() {
    this._user.reload();
  }

  private handleSuccessfulAuthorization(userOr2Fa: UserLoginResponseBody) {
    this._accessToken.set(userOr2Fa.access_token);
    this._refreshToken.set(userOr2Fa.refresh_token);
  }
}
