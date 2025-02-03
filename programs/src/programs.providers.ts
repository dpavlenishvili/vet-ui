import { Provider } from '@angular/core';
import { PROGRAMS_ENVIRONMENT } from './programs.tokens';
import { AuthEnvironment } from '@vet/auth';

export function provideAuthEnvironment(environment: AuthEnvironment): Provider {
  return {
    provide: PROGRAMS_ENVIRONMENT,
    useValue: environment,
  };
}
