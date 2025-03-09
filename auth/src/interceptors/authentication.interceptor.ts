import {
  HttpErrorResponse,
  HttpEvent,
  HttpHandlerFn,
  HttpInterceptorFn,
  HttpRequest,
  HttpStatusCode,
} from '@angular/common/http';
import { inject } from '@angular/core';
import { BehaviorSubject, catchError, filter, finalize, Observable, switchMap, throwError } from 'rxjs';
import { AuthenticationService } from '../authentication.service';
import { authorizationSkipped } from '../skip-authorization-token-ctx';

function handleRequest(
  req: HttpRequest<unknown>,
  next: HttpHandlerFn,
  authenticationService: AuthenticationService,
): Observable<HttpEvent<unknown>> {
  const accessToken = authenticationService.accessToken();
  if (authorizationSkipped(req.context) || !accessToken) {
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
  const _refreshing$ = new BehaviorSubject(false);
  const _refreshSuccess$ = new BehaviorSubject(false);

  return handleRequest(req, next, authenticationService).pipe(
    catchError((err: HttpErrorResponse) => {
      if (err.status === HttpStatusCode.Unauthorized || err.status === HttpStatusCode.Forbidden) {
        if (!_refreshing$.getValue()) {
          _refreshing$.next(true);
          return authenticationService.refresh().pipe(
            switchMap(() => handleRequest(req, next, authenticationService)),
            finalize(() => _refreshing$.next(false)),
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
