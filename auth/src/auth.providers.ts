import { inject, InjectionToken, Provider } from '@angular/core';

export interface AuthEnvironment {
  phoneVerificationNumberLength: number;
  phoneVerificationNumberTimeoutSeconds: number;
  login2faTimeoutSeconds: number;
}

const AUTH_ENVIRONMENT = new InjectionToken<AuthEnvironment>('Environment config for auth module');

export function provideAuthEnvironment(environment: AuthEnvironment): Provider {
  return {
    provide: AUTH_ENVIRONMENT,
    useValue: environment,
  };
}

export function useAuthEnvironment() {
  return inject(AUTH_ENVIRONMENT);
}
