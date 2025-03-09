import {inject} from '@angular/core';
import type {HttpErrorResponse, HttpInterceptorFn} from '@angular/common/http';
import {TranslocoService} from '@jsverse/transloco';
import {NotificationService} from "@progress/kendo-angular-notification";
import {catchError, take, tap, throwError} from 'rxjs';
import {getApiErrorHandler} from "./api-error-ctx";

const reportError = (message: string, notificationService: NotificationService) => {
  notificationService.show({
    content: message,
    type: {
      style: 'error',
      icon: true,
    },
    animation: {type: 'fade', duration: 300},
    hideAfter: 500
  });
}

export const apiErrorInterceptor: HttpInterceptorFn = (req, next) => {
  const translocoService = inject(TranslocoService);
  const notificationService = inject(NotificationService);

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
