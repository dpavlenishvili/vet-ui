import type { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';
import { DialogService } from '@progress/kendo-angular-dialog';
import { inject } from '@angular/core';
import { TranslocoService } from '@jsverse/transloco';

export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  const dialogService = inject(DialogService);
  const translocoService = inject(TranslocoService);

  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      const errorMessage = error.error?.error?.message || translocoService.translate('shared.errorOccurred');
      dialogService.open({
        title: translocoService.translate('shared.errorOccurred'),
        content: errorMessage,
      });
      return throwError(() => error);
    }),
  );
};
