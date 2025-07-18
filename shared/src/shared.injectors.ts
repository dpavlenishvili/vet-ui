import { ComponentRef, computed, Inject, inject, type InjectDecorator } from '@angular/core';
import { v4 as uuid } from 'uuid';

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
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { getRouteNumberParam, getRouteParam, withoutEmptyProperties } from './shared.utils';
import { AlertDialogService } from './services/alert-dialog.service';
import { ConfirmationDialogService } from './services/confirmation-dialog.service';
import { toSignal } from '@angular/core/rxjs-interop';
import { DomSanitizer } from '@angular/platform-browser';
import { ToastService } from './services/toast.service';
import { filter, map, startWith } from 'rxjs';
import { AppDialogService } from './services/app-dialog.service';
import { DialogParams, DialogRef } from './shared.types';

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

export function useJsonQueryParam(name?: string) {
  const routeParamsService = inject(RouteParamsService);
  const rawValue = name ? routeParamsService.getSnapshot()[name] : routeParamsService.getSnapshot();

  console.log(routeParamsService.getSnapshot());
  console.log(rawValue);
  console.log(name);

  return rawValue ? JSON.parse(rawValue) : {};
}

export function useRouteParam(key: string) {
  const activatedRoute = inject(ActivatedRoute);

  return toSignal(getRouteParam(activatedRoute, key));
}

export function useRouteNumberParam(key: string, fallback = NaN) {
  const activatedRoute = inject(ActivatedRoute);

  return toSignal(getRouteNumberParam(activatedRoute, key, fallback));
}

export function useAlert() {
  return inject(AlertDialogService);
}

export function useConfirm() {
  return inject(ConfirmationDialogService);
}

export function useToast() {
  return inject(ToastService);
}

export function useDialog<Inputs = Record<string, unknown>>(
  params: DialogParams<unknown, Inputs>,
): DialogRef<unknown, Inputs> {
  const dialogService = inject(AppDialogService);
  const id = uuid();
  const model = { id, ...params };

  return {
    id,
    ...params,
    show: (inputs: Record<string, unknown> = {}) => dialogService.show({
      ...model,
      inputs: model.inputs ? {
        ...model.inputs,
        ...inputs
      } : inputs,
    }),
    hide: () => dialogService.hide(id),
  }
}

export function useFilters<T extends object>() {
  const activatedRoute = inject(ActivatedRoute);
  const queryParams = toSignal(activatedRoute.queryParamMap);

  return computed<T>(() => {
    return JSON.parse(queryParams()?.get('filters') ?? '{}');
  });
}

export function usePage() {
  const activatedRoute = inject(ActivatedRoute);
  const queryParams = toSignal(activatedRoute.queryParamMap);

  return computed<number>(() => Number(queryParams()?.get('page') ?? 1));
}

export function useFiltersUpdater<T extends object>() {
  const router = inject(Router);

  return (filters: T) => {
    void router.navigate([], {
      queryParamsHandling: 'merge',
      queryParams: withoutEmptyProperties({
        filters: JSON.stringify(withoutEmptyProperties(filters)),
      }),
    });
  }
}

export function usePageUpdater() {
  const router = inject(Router);

  return (page: number | null | undefined) => {
    void router.navigate([], {
      queryParamsHandling: 'merge',
      queryParams: withoutEmptyProperties({
        page,
      }),
    });
  }
}

export function useSanitizedUrl(getUrl: () => string | null | undefined) {
  const sanitizer = inject(DomSanitizer);

  return computed(() => {
    const videoUrl = getUrl();

    return videoUrl
      ? sanitizer.bypassSecurityTrustResourceUrl(videoUrl)
      : undefined;
  });
}

export function useCurrentUrl() {
  const router = inject(Router);

  return toSignal(router.events.pipe(
    filter((event) => event instanceof NavigationEnd),
    map((event) => event.urlAfterRedirects),
    startWith(router.url),
  ));
}

export function useUniqueId(prefix?: string) {
  return computed(() => {
    const id = uuid();

    return prefix ? `${prefix}-${id}` : id;
  })
}
