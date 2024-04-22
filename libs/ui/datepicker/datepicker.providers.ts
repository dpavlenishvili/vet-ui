import { APP_INITIALIZER, DestroyRef, inject } from '@angular/core';
import { TranslocoService } from '@ngneat/transloco';
import { BsLocaleService } from 'ngx-bootstrap/datepicker';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { defineLocale } from 'ngx-bootstrap/chronos';
import { kaLocale } from 'ngx-bootstrap/locale';

defineLocale('ka', kaLocale);

export function provideDatepicker() {
    return {
        provide: APP_INITIALIZER,
        useFactory: () => {
            const translocoService = inject(TranslocoService);
            const bsLocaleService = inject(BsLocaleService);
            const destroyRef = inject(DestroyRef);
            return () => {
                translocoService.langChanges$.pipe(takeUntilDestroyed(destroyRef)).subscribe((lang) => {
                    bsLocaleService.use(lang);
                });
            };
        },
        multi: true,
    };
}
