import { computed, inject, Injectable, Signal, signal } from '@angular/core';
import { finalize, map, Observable, of, tap, throwError } from 'rxjs';
import { catchError, switchMap } from 'rxjs/operators';
import { LOCAL_STORAGE } from '@ng-web-apis/common';
import { AuthService, User, UserLoginResponseBody } from '@vet/backend';
import { takeUntilDestroyed, toObservable } from '@angular/core/rxjs-interop';

interface TokenResponse extends UserLoginResponseBody {
    creation_timestamp: number;
}

@Injectable({
    providedIn: 'root',
})
export class AuthenticationService {
    accessToken$: Signal<string | null>;
    // refreshToken$: Signal<string | null>;
    tokenUser$: Signal<User | null>;
    protected _tokenUser$ = signal<User | null>(null);

    private readonly _storageKeyName = '__user_tokens__';
    private readonly localStorage = inject(LOCAL_STORAGE);

    private readonly _storedTokens = this.localStorage.getItem(this._storageKeyName);
    private _tokens$ = signal(this._storedTokens ? (JSON.parse(this._storedTokens) as TokenResponse) : null);
    private authService = inject(AuthService);

    constructor() {
        this.accessToken$ = computed(() => this._tokens$()?.access_token || null);
        this.tokenUser$ = this._tokenUser$.asReadonly();
        toObservable(this.accessToken$)
            .pipe(
                switchMap((token) => {
                    if (!token) {
                        return of(null);
                    }
                    return this.authService.getUser().pipe(map((userResponse) => userResponse.data as User));
                }),
                takeUntilDestroyed(),
            )
            .subscribe((r) => this._tokenUser$.set(r));
    }

    isAuthenticated(): boolean {
        const tokens = this._tokens$();
        if (!tokens) {
            return false;
        }

        const expiresAt = new Date(tokens.creation_timestamp + tokens.expires_in * 1000);
        return expiresAt > new Date();
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
                this.localStorage.removeItem(this._storageKeyName);
                this._tokens$.set(null);
                return throwError(() => err);
            }),
        );
    }

    logout(): Observable<void> {
        return this.authService.logoutUser().pipe(
            finalize(() => {
                this.localStorage.removeItem(this._storageKeyName);
                this._tokens$.set(null);
            }),
            map(() => undefined),
        );
    }

    private handleSuccessfulAuthorization(data: UserLoginResponseBody) {
        const creationDate = Date.now();
        const tokens = { ...data, creation_timestamp: creationDate };
        this.localStorage.setItem(this._storageKeyName, JSON.stringify(tokens));
        this._tokens$.set(tokens);
    }
}
