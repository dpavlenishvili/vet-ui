import {
  HttpErrorResponse,
  HttpEvent,
  HttpHandlerFn,
  HttpInterceptorFn,
  HttpRequest,
  HttpStatusCode,
} from '@angular/common/http';
import { inject } from '@angular/core';
import { catchError, from, Observable, switchMap, throwError } from 'rxjs';
import Keycloak from 'keycloak-js';

function addAuthHeader(req: HttpRequest<unknown>, token: string): HttpRequest<unknown> {
  return req.clone({
    setHeaders: {
      Authorization: `Bearer ${token}`,
    },
  });
}

export const authenticationInterceptor: HttpInterceptorFn = (
  req: HttpRequest<unknown>,
  next: HttpHandlerFn,
): Observable<HttpEvent<unknown>> => {
  const keycloak = inject<Keycloak>(Keycloak);

  if (!keycloak.token || !keycloak.authenticated) {
    return next(req);
  }

  return next(addAuthHeader(req, keycloak.token)).pipe(
    catchError((err: HttpErrorResponse) => {
      if (err.status !== HttpStatusCode.Unauthorized && err.status !== HttpStatusCode.Forbidden) {
        return throwError(() => err);
      }

      return from(keycloak.updateToken(30)).pipe(
        switchMap((updated) => {
          if (updated && keycloak.token) {
            return next(addAuthHeader(req, keycloak.token));
          }
          return throwError(() => err);
        }),
        catchError(() => {
          return throwError(() => err);
        }),
      );
    }),
  );
};
