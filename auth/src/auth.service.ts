import { computed, inject, Injectable, type Signal, signal } from '@angular/core';
import { takeUntilDestroyed, toObservable } from '@angular/core/rxjs-interop';
import { SsrCookieService } from 'ngx-cookie-service-ssr';
import { finalize, map, Observable, of, tap, throwError } from 'rxjs';
import { catchError, switchMap } from 'rxjs/operators';
import { AuthService as AuthApiService, type User, type UserLoginResponseBody } from '@vet/backend';

const ACCESS_TOKEN_STORAGE_KEY = '__user_tokens__';
const REFRESH_TOKEN_STORAGE_KEY = '__user_tokens_refresh__';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  accessToken$: Signal<string | null>;
  refreshToken$: Signal<string | null>;
  tokenUser$: Signal<User | null>;
  authenticated$ = computed(() => !!this.tokenUser$());

  protected _tokenUser$ = signal<User | null>(null);

  private readonly cookieService = inject(SsrCookieService);

  private _accessToken$ = signal(this.cookieService.get(ACCESS_TOKEN_STORAGE_KEY) || null);
  private _refreshToken$ = signal(this.cookieService.get(REFRESH_TOKEN_STORAGE_KEY) || null);
  private authService = inject(AuthApiService);

  constructor() {
    this.accessToken$ = this._accessToken$.asReadonly();
    this.refreshToken$ = this._refreshToken$.asReadonly();
    this.tokenUser$ = this._tokenUser$.asReadonly();
    toObservable(this.accessToken$)
      .pipe(
        switchMap((token) => {
          if (!token) {
            return of(null);
          }
          return this.authService.getUser().pipe(map((userResponse) => userResponse.data as User));
        }),
        catchError(() => of(null)),
        takeUntilDestroyed(),
      )
      .subscribe((r) => this._tokenUser$.set(r));
  }

  login(pid: string, password: string) {
    return this.authService.loginUser({ pid, password }).pipe(
      tap((userOr2Fa) => {
        if ('access_token' in userOr2Fa) {
          this.handleSuccessfulAuthorization(userOr2Fa);
        }
      }),
    );
  }

  validate2FaCode(pid: string, password: string, code: string) {
    return this.authService
      .validate2FaCode({ pid, password, code })
      .pipe(tap((data) => this.handleSuccessfulAuthorization(data)));
  }

  refresh() {
    return of(null);

    // const refreshToken = this.refreshToken$();
    //
    // if (!refreshToken) {
    //   return of(null);
    // }
    //
    // return this.authService.refreshToken({
    //   refresh_token: refreshToken,
    // }).pipe(
    //   tap((data) => this.handleSuccessfulAuthorization(data)),
    //   catchError((err) => {
    //     this.cookieService.delete(ACCESS_TOKEN_STORAGE_KEY);
    //     this._accessToken$.set(null);
    //     this._refreshToken$.set(null);
    //     return throwError(() => err);
    //   }),
    // );
  }

  logout(): Observable<void> {
    return this.authService.logoutUser().pipe(
      finalize(() => {
        this.cookieService.delete(ACCESS_TOKEN_STORAGE_KEY);
        this._accessToken$.set(null);
      }),
      map(() => undefined),
    );
  }

  private handleSuccessfulAuthorization(data: UserLoginResponseBody) {
    this.cookieService.set(ACCESS_TOKEN_STORAGE_KEY, data.access_token);
    this.cookieService.set(REFRESH_TOKEN_STORAGE_KEY, data.refresh_token);
    this._accessToken$.set(data.access_token);
    this._refreshToken$.set(data.refresh_token);
  }
}
