import type { AuthEnvironment } from '@vet/auth';

export const environment = {
  production: true,
  baseUrl: 'https://dev2-api-vet.emis.ge',
  apiBaseUrl: 'https://dev2-api-vet.emis.ge/api/v1',
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
