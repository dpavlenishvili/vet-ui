import type { AuthEnvironment } from '@vet/auth';
import { AppFeatureFlags } from '@vet/feature-flags';
import { createInterceptorCondition, IncludeBearerTokenCondition } from 'keycloak-angular';

const urlCondition = createInterceptorCondition<IncludeBearerTokenCondition>({
  urlPattern:
    /^(https:\/\/proxy-service-dev\.vet\.dev\.apps\.emis\.ge)(\/.*)?$/i,
  bearerPrefix: 'Bearer',
});

export const baseEnvironment = {
  production: false,
  baseUrl: '',
  apiBaseUrl: '/api/v1',
  defaultDateFormat: 'YYYY-MM-DD',
  defaultDateTimeFormat: 'YYYY-MM-DD HH:mm:ss',
  defaultDisplayDateFormat: 'DD/MM/YYYY',
  defaultDisplayDateTimeFormat: 'DD/MM/YYYY HH:mm:ss',
  defaultDisplayDateSeparator: '/',
  defaultDateFallback: '---',
  defaultDateTimeFallback: '---',
  kendoDatePickerFormat: 'dd/MM/yyyy',
  kendoDateTimePickerFormat: 'dd/MM/yyyy HH:mm:ss',
  modules: {
    auth: <AuthEnvironment>{
      phoneVerificationNumberLength: 4,
      phoneVerificationNumberTimeoutSeconds: 120,
      login2faTimeoutSeconds: 120,
      authDataTtlInSeconds: 30 * 24 * 60 * 60,
      keycloak: {
        authority: 'https://auth-test.emis.ge/auth',
        realm: 'main',
        clientId: 'vet-front',
        redirectUri: 'http://localhost:4200',
        bearerTokenConditions: [urlCondition],
        sessionTimeout: 900000,
        onInactivityTimeout: 'logout',
      },
    },
  },
  featureFlags: {} as AppFeatureFlags,
};
