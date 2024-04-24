import { HttpErrorResponse, HttpEvent, HttpHandlerFn, HttpInterceptorFn, HttpRequest } from '@angular/common/http';
import { BehaviorSubject, Observable, throwError } from 'rxjs';
import { inject } from '@angular/core';
import { AuthenticationService } from './authentication.service';
import { catchError, filter, switchMap, tap } from 'rxjs/operators';

const _refreshing$ = new BehaviorSubject(false);
const _refreshSuccess$ = new BehaviorSubject(false);

function handleRequest(
    req: HttpRequest<unknown>,
    next: HttpHandlerFn,
    authenticationService: AuthenticationService,
): Observable<HttpEvent<unknown>> {
    const accessToken = authenticationService.accessToken$();
    if (!accessToken) {
        return next(req);
    }
    return next(
        req.clone({
            setHeaders: {
                Authorization: `Bearer ${accessToken}`,
            },
        }),
    );
}

export const authenticationInterceptor: HttpInterceptorFn = (
    req: HttpRequest<unknown>,
    next: HttpHandlerFn,
): Observable<HttpEvent<unknown>> => {
    const authenticationService = inject(AuthenticationService);
    return handleRequest(req, next, authenticationService).pipe(
        catchError((err: HttpErrorResponse) => {
            if (err.status === 401) {
                if (!_refreshing$.getValue()) {
                    _refreshing$.next(true);
                    return authenticationService.refresh().pipe(
                        tap({
                            next: () => _refreshSuccess$.next(true),
                            error: () => _refreshSuccess$.next(false),
                        }),
                        switchMap(() => handleRequest(req, next, authenticationService)),
                        tap(() => _refreshing$.next(false)),
                        catchError((err: HttpErrorResponse) => {
                            _refreshing$.next(false);
                            return throwError(() => err);
                        }),
                    );
                }
                return _refreshing$.pipe(
                    filter((refreshing) => !refreshing),
                    switchMap(() => _refreshSuccess$),
                    filter((refreshSuccess) => refreshSuccess),
                    switchMap(() => handleRequest(req, next, authenticationService)),
                );
            }
            return throwError(() => err);
        }),
    );
};
