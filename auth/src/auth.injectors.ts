import { inject } from '@angular/core';
import { AUTH_ENVIRONMENT } from './auth.tokens';
import { type AuthEnvironment } from './auth.types';

export function useAuthEnvironment(): AuthEnvironment {
  return inject<AuthEnvironment>(AUTH_ENVIRONMENT);
}
