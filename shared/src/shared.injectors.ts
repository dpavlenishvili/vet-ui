import { Inject, inject, type InjectDecorator } from '@angular/core';

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
} from './shared.tokens';
import { RouteParamsService } from './services/route-params.service';
import { ActivatedRoute } from '@angular/router';
import { getRouteNumberParam, getRouteParam } from './shared.utils';

export function useBaseApiUrl(): string {
  return inject(BASE_API_URL);
}

export function useBaseUrl(): string {
  return inject(BASE_URL);
}

export function useEnvironment<T>(): T {
  return inject<T>(ENVIRONMENT);
}

export function useDefaultDateFormat() {
  return inject<string>(DEFAULT_DATE_FORMAT);
}

export function useDefaultDateTimeFormat() {
  return inject<string>(DEFAULT_DATE_TIME_FORMAT);
}

export function useDefaultDisplayDateFormat() {
  return inject<string>(DEFAULT_DISPLAY_DATE_FORMAT);
}

export function useDefaultDisplayDateTimeFormat() {
  return inject<string>(DEFAULT_DISPLAY_DATE_TIME_FORMAT);
}

export function useDefaultDateFallback() {
  return inject<string>(DEFAULT_DATE_FALLBACK);
}

export function useDefaultDateTimeFallback() {
  return inject<string>(DEFAULT_DATE_TIME_FALLBACK);
}

export function useKendoDatePickerFormat() {
  return inject<string>(KENDO_DATE_PICKER_FORMAT);
}

export function useKendoDateTimePickerFormat() {
  return inject<string>(KENDO_DATE_TIME_PICKER_FORMAT);
}

export function InjectEnvironment(): InjectDecorator {
  return Inject(ENVIRONMENT);
}

export function useJsonQueryParam(name: string) {
  const routeParamsService = inject(RouteParamsService);
  const rawValue = routeParamsService.getSnapshot()[name];

  return rawValue ? JSON.parse(rawValue) : {};
}

export function useRouteParam(key: string) {
  const activatedRoute = inject(ActivatedRoute);

  return getRouteParam(activatedRoute, key);
}

export function useRouteNumberParam(key: string, fallback = NaN) {
  const activatedRoute = inject(ActivatedRoute);

  return getRouteNumberParam(activatedRoute, key, fallback);
}
