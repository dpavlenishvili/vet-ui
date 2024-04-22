import { APP_INITIALIZER } from '@angular/core';
import { setTheme } from 'ngx-bootstrap/utils';

export function useBs5Theme() {
    return {
        provide: APP_INITIALIZER,
        useFactory: () => () => setTheme('bs5'),
        multi: true,
    };
}
