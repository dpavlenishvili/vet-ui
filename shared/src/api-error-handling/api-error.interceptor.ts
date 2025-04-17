import {inject, PLATFORM_ID} from '@angular/core';
import type {HttpErrorResponse, HttpInterceptorFn} from '@angular/common/http';
import {TranslocoService} from '@jsverse/transloco';
import {NotificationService} from "@progress/kendo-angular-notification";
import {catchError, take, tap, throwError} from 'rxjs';
import {getApiErrorHandler} from "./api-error-ctx";
import {isPlatformServer} from "@angular/common";

const reportError = (message: string, notificationService: NotificationService) => {
  notificationService.show({
    content: message,
    animation: { type: 'slide', duration: 400 },
    position: { horizontal: 'center', vertical: 'top' },
    type: { style: 'error', icon: true },
    hideAfter: 3000,
  });
}

export const apiErrorInterceptor: HttpInterceptorFn = (req, next) => {
  const translocoService = inject(TranslocoService);
  const notificationService = inject(NotificationService);
  const platformId = inject(PLATFORM_ID);

  if (isPlatformServer(platformId)) {
    return next(req);
  }

  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      const errorHandler = getApiErrorHandler(req.context);
      if (!errorHandler) {
        return throwError(() => error);
      }
      const { message, translate, excludedStatuses } = errorHandler(error);
      if (!message || excludedStatuses?.includes(error.status)) {
        return throwError(() => error);
      }
      if (translate) {
        return translocoService.selectTranslate(message).pipe(
          take(1),
          tap((translatedMessage) => reportError(translatedMessage, notificationService)),
          tap(() => throwError(() => error))
        )
      }
      reportError(message, notificationService);
      return throwError(() => error);
    }),
  );
};
