import {inject, PLATFORM_ID} from '@angular/core';
import type {HttpErrorResponse, HttpInterceptorFn} from '@angular/common/http';
import {TranslocoService} from '@jsverse/transloco';
import {catchError, throwError} from 'rxjs';
import { getApiErrorHandler, getApiErrorUiHandler, useToastApiErrorHandler } from './api-error-ctx';
import {isPlatformServer} from "@angular/common";

export const apiErrorInterceptor: HttpInterceptorFn = (req, next) => {
  const translocoService = inject(TranslocoService);
  const platformId = inject(PLATFORM_ID);
  const defaultApiErrorUiHandler = useToastApiErrorHandler();

  if (isPlatformServer(platformId)) {
    return next(req);
  }

  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      const errorHandler = getApiErrorHandler(req.context);
      const uiHandler = getApiErrorUiHandler(req.context) ?? defaultApiErrorUiHandler;

      if (!errorHandler) {
        return throwError(() => error);
      }

      const { code = 0, message, excludedStatuses } = errorHandler(error);

      if (!code || excludedStatuses?.includes(error.status)) {
        return throwError(() => error);
      }

      const key = `errors.server_error_${code}`;
      let translatedMessage = translocoService.translate(key);

      if (key === translatedMessage) {
        translatedMessage = translocoService.translate(message ?? 'errors.server_error_0');
      } else if (message) {
        translatedMessage = translocoService.translate(message);
      }

      const resolvedError = {
        code: code ?? 0,
        message: translatedMessage,
      };

      if (code !== 1004) {
        uiHandler(resolvedError)
      }

      return throwError(() => error);
    }),
  );
};
