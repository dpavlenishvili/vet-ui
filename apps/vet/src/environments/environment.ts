import type { AuthEnvironment } from '@vet/auth';
import {BuildVars} from "./build-vars.interface";
import {AppFeatureFlags} from "@vet/feature-flags";
import { baseEnvironment } from './environment.base';
import { createInterceptorCondition, IncludeBearerTokenCondition } from 'keycloak-angular';

declare const BUILD_VARS: BuildVars;

const baseUrl = BUILD_VARS.APP_BASE_URL || 'https://new-api.vet.ge';

const featureFlags: AppFeatureFlags = {
  vacancies: true
}

const urlCondition = createInterceptorCondition<IncludeBearerTokenCondition>({
  urlPattern:
    new RegExp(`^${baseUrl}(\\/.*)?$`, 'g'),
  bearerPrefix: 'Bearer',
});

export const environment = {
  ...baseEnvironment,
  production: true,
  baseUrl,
  apiBaseUrl: `${baseUrl}/api/v1`,
  modules: {
    auth: <AuthEnvironment>{
      ...baseEnvironment.modules.auth,
      keycloak: {
        ...baseEnvironment.modules.auth.keycloak,
        authority: 'https://auth.emis.ge/auth',
        realm: 'main',
        clientId: 'vet-front',
        redirectUri: 'https://vet.ge',
        bearerTokenConditions: [urlCondition],
      },
    },
  },
  featureFlags,
};
