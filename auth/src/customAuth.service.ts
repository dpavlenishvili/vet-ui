import { computed, inject, Injectable, Signal, signal } from '@angular/core';
import { takeUntilDestroyed, toObservable } from '@angular/core/rxjs-interop';
import { SsrCookieService } from 'ngx-cookie-service-ssr';
import { finalize, map, Observable, of, tap, throwError } from 'rxjs';
import { catchError, switchMap } from 'rxjs/operators';
import { AuthService as AuthApiService, User, UserLoginResponseBody } from '@vet/backend';

const _storageKeyName = '__user_tokens__';

@Injectable({
    providedIn: 'root',
})
export class CustomAuthService {
    accessToken$: Signal<string | null>;
    tokenUser$: Signal<User | null>;
    authenticated$ = computed(() => !!this.tokenUser$());

    protected _tokenUser$ = signal<User | null>(null);

    private readonly cookieService = inject(SsrCookieService);

    private _accessToken$ = signal(this.cookieService.get(_storageKeyName) || null);
    private authService = inject(AuthApiService);

    constructor() {
        this.accessToken$ = this._accessToken$.asReadonly();
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
        return this.authService.refreshToken().pipe(
            tap((data) => this.handleSuccessfulAuthorization(data)),
            catchError((err) => {
                this.cookieService.delete(_storageKeyName);
                this._accessToken$.set(null);
                return throwError(() => err);
            }),
        );
    }

    logout(): Observable<void> {
        return this.authService.logoutUser().pipe(
            finalize(() => {
                this.cookieService.delete(_storageKeyName);
                this._accessToken$.set(null);
            }),
            map(() => undefined),
        );
    }

    handleSuccessfulAuthorization(data: UserLoginResponseBody) {
        const expirationDate = new Date(data.expires_in * 1000 + Date.now());
        this.cookieService.set(_storageKeyName, data.access_token, expirationDate);
        this._accessToken$.set(data.access_token);
    }
}
