import type { AuthEnvironment } from '@vet/auth';

export const environment = {
  production: false,
  baseUrl: 'https://dev-api-vet.emis.ge',
  apiBaseUrl: 'https://dev-api-vet.emis.ge/api/v1',
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
      phoneVerificationNumberLength: 6,
      phoneVerificationNumberTimeoutSeconds: 120,
      login2faTimeoutSeconds: 120,
    },
  },
};
