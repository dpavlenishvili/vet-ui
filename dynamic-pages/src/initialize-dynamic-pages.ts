import { APP_INITIALIZER, inject, Provider } from '@angular/core';
import { first } from 'rxjs';
import { ApplicationPagesService } from './dynamic-pages/dynamic-pages.service';

function dynamicPagesInitializerFactory() {
    const x = inject(ApplicationPagesService);

    return () => {
        return x.configureRoutes().pipe(first());
    };
}

export const dynamicPagesInitializer = (): Provider => {
    return {
        provide: APP_INITIALIZER,
        useFactory: dynamicPagesInitializerFactory,
        multi: true,
    };
};
