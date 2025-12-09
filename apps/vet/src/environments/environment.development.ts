import type { AuthEnvironment } from '@vet/auth';
import {BuildVars} from "./build-vars.interface";
import {AppFeatureFlags} from "@vet/feature-flags";
import { baseEnvironment } from './environment.base';

declare const BUILD_VARS: BuildVars;

const baseUrl = BUILD_VARS.APP_BASE_URL ?? 'https://develop-vet-back.dev01.dev.emis.ge';

const featureFlags: AppFeatureFlags = {
  vacancies: true
}

export const environment = {
  ...baseEnvironment,
  production: false,
  baseUrl,
  apiBaseUrl: `${baseUrl}/api/v1`,
  modules: {
    auth: <AuthEnvironment>{
      ...baseEnvironment.modules.auth,
      keycloak: {
        ...baseEnvironment.modules.auth.keycloak,
        authority: 'https://auth-test.emis.ge/auth',  // ← ADDED THIS LINE
        realm: 'main',                                 // ← ADDED THIS LINE
        clientId: 'vet-front',                        // ← ADDED THIS LINE
        redirectUri: 'https://vet-front-develop.dev01.dev.emis.ge',
      },
    },
  },
  featureFlags
};