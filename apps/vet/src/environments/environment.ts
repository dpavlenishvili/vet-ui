import type { AuthEnvironment } from '@vet/auth';
import {BuildVars} from "./build-vars.interface";

declare const BUILD_VARS: BuildVars;

const baseUrl = BUILD_VARS.APP_BASE_URL ?? 'https://develop-vet-back.dev01.dev.emis.ge';

export const environment = {
  production: true,
  baseUrl,
  apiBaseUrl: `${baseUrl}/api/v1`,
  defaultDateFormat: 'YYYY-MM-DD',
  defaultDateTimeFormat: 'YYYY-MM-DD HH:mm:ss',
  defaultDisplayDateFormat: 'DD/MM/YYYY',
  defaultDisplayDateTimeFormat: 'DD/MM/YYYY HH:mm:ss',
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
    },
  },
};
