import { inject, InjectionToken, Provider } from '@angular/core';
import {
  AutoRefreshTokenService,
  BearerTokenCondition,
  INCLUDE_BEARER_TOKEN_INTERCEPTOR_CONFIG,
  provideKeycloak,
  UserActivityService,
  withAutoRefreshToken,
} from 'keycloak-angular';

export interface AuthEnvironment {
  phoneVerificationNumberLength: number;
  phoneVerificationNumberTimeoutSeconds: number;
  login2faTimeoutSeconds: number;
  authDataTtlInSeconds: number;
  keycloak: AuthEnvironmentSso;
}

export interface AuthEnvironmentSso {
  authority: string;
  redirectUri: string;
  postLogoutRedirectUri?: string;
  realm: string;
  clientId: string;
  clientSecret?: string;
  bearerTokenConditions: BearerTokenCondition[];
  sessionTimeout: number;
  onInactivityTimeout: 'login' | 'logout' | 'none';
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

export function provideSso(params: AuthEnvironmentSso) {
  return provideKeycloak({
    config: {
      url: params.authority,
      realm: params.realm,
      clientId: params.clientId,
    },
    initOptions: {
      checkLoginIframe: false, // Disable iframe to avoid CSP violations
      checkLoginIframeInterval: 0, // Disable iframe polling
      // redirectUri: params.redirectUri, // Removed to prevent redirect to home
      onLoad: 'check-sso',
      silentCheckSsoRedirectUri:
        // eslint-disable-next-line no-restricted-globals
        typeof window !== 'undefined' ? `${window.location.origin}/assets/silent-check-sso.html` : undefined,
      pkceMethod: 'S256',
    },
    features: [
      withAutoRefreshToken({
        onInactivityTimeout: params.onInactivityTimeout,
        sessionTimeout: params.sessionTimeout,
      }),
    ],
    providers: [
      AutoRefreshTokenService,
      UserActivityService,
      {
        provide: INCLUDE_BEARER_TOKEN_INTERCEPTOR_CONFIG,
        useValue: params.bearerTokenConditions,
      },
    ],
  });
}
