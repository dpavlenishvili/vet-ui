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
import { authorizationSkipped } from '../skip-authorization-token-ctx';
import { AuthenticationService } from '../authentication.service';

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
  const authService = inject(AuthenticationService);

  if (authorizationSkipped(req.context) || !authService.hasTokens()) {
    return next(req);
  }

  return next(addAuthHeader(req, authService.accessToken())).pipe(
    catchError((err: HttpErrorResponse) => {
      if (err.status !== HttpStatusCode.Unauthorized && err.status !== HttpStatusCode.Forbidden) {
        // Not an auth error, just propagate
        return throwError(() => err);
      }

      return from(authService.handleUnauthorized()).pipe(
        switchMap((success) => {
          if (success) {
            return next(addAuthHeader(req, authService.accessToken()));
          }

          return throwError(() => err);
        }),
      );
    }),
  );
};
