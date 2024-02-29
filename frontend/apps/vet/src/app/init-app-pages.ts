import { ApplicationPagesService } from './application-pages.service';
import { firstValueFrom } from 'rxjs';
import { APP_INITIALIZER } from '@angular/core';

function configurePagesInitializerFn(pagesService: ApplicationPagesService): () => Promise<unknown> {
    return () => firstValueFrom(pagesService.configureRoutes());
}

export const initAppPages = {
    provide: APP_INITIALIZER,
    useFactory: configurePagesInitializerFn,
    deps: [ApplicationPagesService],
    multi: true,
};
