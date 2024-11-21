import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { TranslocoService } from '@jsverse/transloco';

export const acceptLanguageInterceptor: HttpInterceptorFn = (req, next) => {
    const translocoService = inject(TranslocoService);
    const lang = translocoService.getActiveLang();
    return next(
        req.clone({
            setHeaders: {
                'Accept-Language': lang,
            },
        }),
    );
};
