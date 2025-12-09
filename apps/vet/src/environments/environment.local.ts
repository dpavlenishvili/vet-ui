import type { AuthEnvironment } from '@vet/auth';
import {BuildVars} from "./build-vars.interface";
import {AppFeatureFlags} from "@vet/feature-flags";
import { baseEnvironment } from './environment.base';

declare const BUILD_VARS: BuildVars;

const baseUrl = BUILD_VARS.APP_BASE_URL ?? '';

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
        redirectUri: 'http://localhost:4200',
      },
    },
  },
  featureFlags,
};
