import {
  HttpErrorResponse,
  HttpEvent,
  HttpHandlerFn,
  HttpInterceptorFn,
  HttpRequest,
  HttpStatusCode,
} from '@angular/common/http';
import { inject } from '@angular/core';
import { BehaviorSubject, catchError, filter, finalize, Observable, switchMap, tap, throwError } from 'rxjs';
import { AuthenticationService } from '../authentication.service';
import { authorizationSkipped } from '../skip-authorization-token-ctx';

const _refreshing$ = new BehaviorSubject(false);
const _refreshSuccess$ = new BehaviorSubject<boolean | null>(null);

function handleRequest(
  req: HttpRequest<unknown>,
  next: HttpHandlerFn,
  authenticationService: AuthenticationService,
): Observable<HttpEvent<unknown>> {
  const token = authenticationService.accessToken();
  if (!token) {
    return next(req);
  }

  return next(
    req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`,
      },
    }),
  );
}

export const authenticationInterceptor: HttpInterceptorFn = (
  req: HttpRequest<unknown>,
  next: HttpHandlerFn,
): Observable<HttpEvent<unknown>> => {
  const authenticationService = inject(AuthenticationService);

  if (authorizationSkipped(req.context) || !authenticationService.accessToken()) {
    return next(req);
  }

  return handleRequest(req, next, authenticationService).pipe(
    catchError((err: HttpErrorResponse) => {
      if (err.status === HttpStatusCode.Unauthorized || err.status === HttpStatusCode.Forbidden) {
        if (!_refreshing$.getValue()) {
          _refreshing$.next(true);
          return authenticationService.refreshToken().pipe(
            tap({
              next: () => {
                _refreshSuccess$.next(true);
              },
              error: () => {
                _refreshSuccess$.next(false);
                authenticationService.clearTokens();
              },
            }),
            switchMap(() => handleRequest(req, next, authenticationService)),
            catchError(() => throwError(() => err)),
            finalize(() => {
              _refreshing$.next(false);
              _refreshSuccess$.next(null);
            }),
          );
        }
        return _refreshing$.pipe(
          filter((refreshing) => !refreshing),
          switchMap(() => _refreshSuccess$),
          filter((refreshSuccess) => refreshSuccess !== null),
          switchMap((refreshSuccess) => {
            if (refreshSuccess) {
              return handleRequest(req, next, authenticationService);
            }
            throw err;
          }),
        );
      }
      return throwError(() => err);
    }),
  );
};
