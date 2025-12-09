import type { AuthEnvironment } from '@vet/auth';
import {BuildVars} from "./build-vars.interface";
import {AppFeatureFlags} from "@vet/feature-flags";
import { baseEnvironment } from './environment.base';

declare const BUILD_VARS: BuildVars;

const baseUrl = BUILD_VARS.APP_BASE_URL ?? 'https://dev2-api-vet.emis.ge';

const featureFlags: AppFeatureFlags = {
  vacancies: true
}

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
      },
    },
  },
  featureFlags,
};
