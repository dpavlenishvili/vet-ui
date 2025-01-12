import { InjectionToken } from '@angular/core';

export const BASE_API_URL = new InjectionToken<string>('Api base URL.');
export const BASE_URL = new InjectionToken<string>('Api base URL.');

export const ENVIRONMENT = new InjectionToken('Environment config, such as API base URL, etc.');
export const SAML_LOGIN_URL = new InjectionToken<string>('SAML Login URL');
export const DEFAULT_DATE_FORMAT = new InjectionToken<string>(
  'The default date-time format to be used internally (e.g. when sending date to API)',
);
export const DEFAULT_DATE_TIME_FORMAT = new InjectionToken<string>(
  'The default date format to be used internally (e.g. when sending date to API',
);
export const DEFAULT_DISPLAY_DATE_FORMAT = new InjectionToken<string>(
  'The default date-time format to be used in UI, when displaying it to user',
);
export const DEFAULT_DISPLAY_DATE_TIME_FORMAT = new InjectionToken<string>(
  'The default date format to be used in UI, when displaying it to user',
);
export const DEFAULT_DATE_FALLBACK = new InjectionToken<string>(
  'The default fallback text to be used when source date-time is empty',
);
export const DEFAULT_DATE_TIME_FALLBACK = new InjectionToken<string>(
  'The default fallback text to be used when source date is empty',
);
export const KENDO_DATE_PICKER_FORMAT = new InjectionToken<string>(
  'The default date-time format intended to be used in kendo date-time pickers',
);
export const KENDO_DATE_TIME_PICKER_FORMAT = new InjectionToken<string>(
  'The default date format intended to be used in kendo date pickers',
);
