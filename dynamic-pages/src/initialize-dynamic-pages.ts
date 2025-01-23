import { inject, type EnvironmentProviders, provideAppInitializer } from '@angular/core';
import { first } from 'rxjs';
import { ApplicationPagesService } from './dynamic-pages/dynamic-pages.service';

function dynamicPagesInitializerFactory() {
  const x = inject(ApplicationPagesService);

  return () => {
    return x.configureRoutes().pipe(first());
  };
}

export const dynamicPagesInitializer = (): EnvironmentProviders => {
  return provideAppInitializer(() => {
    const initializerFn = dynamicPagesInitializerFactory();
    return initializerFn();
  });
};
