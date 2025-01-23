import type { Provider, ValueProvider } from '@angular/core';
import {
  BASE_API_URL,
  BASE_URL,
  DEFAULT_DATE_FALLBACK,
  DEFAULT_DATE_FORMAT,
  DEFAULT_DATE_TIME_FALLBACK,
  DEFAULT_DATE_TIME_FORMAT,
  DEFAULT_DISPLAY_DATE_FORMAT,
  DEFAULT_DISPLAY_DATE_TIME_FORMAT,
  ENVIRONMENT,
  KENDO_DATE_PICKER_FORMAT,
  KENDO_DATE_TIME_PICKER_FORMAT,
  SAML_LOGIN_URL,
} from './shared.tokens';

export function provideEnvironment(environment: object): Provider {
  return {
    provide: ENVIRONMENT,
    useValue: environment,
  };
}

export function provideBaseApiUrl(url: string): ValueProvider {
  return {
    provide: BASE_API_URL,
    useValue: url,
  };
}

export function provideBaseUrl(baseUrl: string): Provider {
  return {
    provide: BASE_URL,
    useValue: baseUrl,
  };
}

export function provideSamlLoginUrl(url: string): Provider {
  return {
    provide: SAML_LOGIN_URL,
    useValue: url,
  };
}

export function provideDefaultDateFormat(format: string): Provider {
  return {
    provide: DEFAULT_DATE_FORMAT,
    useValue: format,
  };
}

export function provideDefaultDateTimeFormat(format: string): Provider {
  return {
    provide: DEFAULT_DATE_TIME_FORMAT,
    useValue: format,
  };
}

export function provideDefaultDateFallback(format: string): Provider {
  return {
    provide: DEFAULT_DATE_FALLBACK,
    useValue: format,
  };
}

export function provideDefaultDateTimeFallback(format: string): Provider {
  return {
    provide: DEFAULT_DATE_TIME_FALLBACK,
    useValue: format,
  };
}

export function provideDefaultDisplayDateFormat(format: string): Provider {
  return {
    provide: DEFAULT_DISPLAY_DATE_FORMAT,
    useValue: format,
  };
}

export function provideDefaultDisplayDateTimeFormat(format: string): Provider {
  return {
    provide: DEFAULT_DISPLAY_DATE_TIME_FORMAT,
    useValue: format,
  };
}

export function provideKendoDatePickerFormat(format: string): Provider {
  return {
    provide: KENDO_DATE_PICKER_FORMAT,
    useValue: format,
  };
}

export function provideKendoDateTimePickerFormat(format: string): Provider {
  return {
    provide: KENDO_DATE_TIME_PICKER_FORMAT,
    useValue: format,
  };
}
