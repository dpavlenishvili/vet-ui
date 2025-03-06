import * as R from 'ramda';
import type { AppBreadCrumbItem, DictionaryType, Option, QueryParams } from './shared.types';
import { map, Observable } from 'rxjs';
import { ActivatedRoute, type Params } from '@angular/router';

export const isEmptyOrUndefined = R.anyPass([R.isEmpty, R.isNil]);

export function withoutEmptyProperties(params: Params) {
  const filteredParams: Params = {};

  for (const [key, value] of Object.entries(params)) {
    if (isEmptyOrUndefined(value)) {
      continue;
    }

    filteredParams[key] = value && typeof value === 'object' ? withoutEmptyProperties(value) : value;
  }

  return filteredParams;
}

/**
 * Converts nested query params into bracketed-notation string
 * Example: { "filters": { "a": "b" } } becomes filters[a]=b
 *
 * @param obj
 * @param prefix
 */
export const flattenQueryParams = (obj: QueryParams, prefix?: string): Record<string, string> =>
  R.pipe(
    R.toPairs,
    R.reduce((red, [key, value]) => {
      const nestedKey = prefix ? `${prefix}[${key.toString()}]` : key.toString();

      if (!R.is(Object, value)) {
        return value === undefined
          ? red
          : {
              ...red,
              [nestedKey]: value as string,
            };
      }

      return {
        ...red,
        ...flattenQueryParams(value as QueryParams, nestedKey),
      };
    }, {}),
  )(obj) as unknown as Record<string, string>;

/**
 * Converts nested objects into JSON-strings preserving types
 * @param params
 */
export const stringifyNestedObjects = (params: Params): Record<string, string> => {
  const encodedParams: Record<string, string> = {};

  for (const [key, value] of Object.entries(params)) {
    encodedParams[key] = value && typeof value === 'object' ? JSON.stringify(value) : value;
  }

  return encodedParams;
};

/**
 * Parses nested JSON strings returning original nested object
 * @param params
 */
export const parseNestedObjects = (params: Params): Params => {
  const decodedParams: Params = {};

  for (const [key, value] of Object.entries(params)) {
    decodedParams[key] = isJsonEncodedObject(value) ? JSON.parse(value) : value;
  }

  return decodedParams;
};

export function isJsonEncodedObject(value: unknown): value is string {
  return typeof value === 'string' && value[0] === '{' && value[value.length - 1] === '}';
}

export const toQueryString = (obj: QueryParams): string =>
  R.pipe(
    flattenQueryParams,
    R.toPairs,
    R.map(([key, value]) => `${encodeURIComponent(key.toString())}=${encodeURIComponent(value.toString())}`),
    R.join('&'),
  )(obj);

export function extractData<T extends { data: unknown }>(): (source: Observable<T>) => Observable<T['data']> {
  return (source: Observable<T>) => source.pipe(map(({ data }) => data));
}

export function dictionaryItemToOption(dictionaryItem: DictionaryType): Option {
  return {
    value: dictionaryItem.id,
    label: dictionaryItem.name,
  };
}

export function getRouteParam(activatedRoute: ActivatedRoute, key: string): Observable<string | null>;
export function getRouteParam(activatedRoute: ActivatedRoute, key: string, fallback: string): Observable<string>;
export function getRouteParam(
  activatedRoute: ActivatedRoute,
  key: string,
  fallback: string | null = null,
): Observable<string | null> {
  return activatedRoute.paramMap.pipe(
    map((params) => params.get(key)),
    map((value) => value ?? fallback),
  );
}

export function getRouteNumberParam(activatedRoute: ActivatedRoute, key: string): Observable<number>;
export function getRouteNumberParam(activatedRoute: ActivatedRoute, key: string, fallback: number): Observable<number>;
export function getRouteNumberParam(activatedRoute: ActivatedRoute, key: string, fallback = NaN): Observable<number> {
  return getRouteParam(activatedRoute, key).pipe(map((value) => (value !== null ? Number(value) : fallback)));
}

export function getRouteParamSnapshot(activatedRoute: ActivatedRoute, key: string): string | null;
export function getRouteParamSnapshot(activatedRoute: ActivatedRoute, key: string, fallback: string): string;
export function getRouteParamSnapshot(
  activatedRoute: ActivatedRoute,
  key: string,
  fallback: string | null = null,
): string | null {
  return activatedRoute.snapshot.paramMap.get(key) ?? fallback;
}

export function getRouteNumberParamSnapshot(activatedRoute: ActivatedRoute, key: string): number;
export function getRouteNumberParamSnapshot(activatedRoute: ActivatedRoute, key: string, fallback: number): number;
export function getRouteNumberParamSnapshot(activatedRoute: ActivatedRoute, key: string, fallback = NaN): number {
  const value = getRouteParamSnapshot(activatedRoute, key);

  return value !== null ? Number(value) : fallback;
}

export function getLastRoute(activatedRoute: ActivatedRoute) {
  let currentRoute = activatedRoute;

  while (currentRoute.children.length > 0) {
    const lastChild = currentRoute.children[currentRoute.children.length - 1];

    if (Object.keys(lastChild.snapshot.data).length === 0) {
      break;
    }

    currentRoute = lastChild;
  }

  return currentRoute;
}

export function collectParams(activatedRoute: ActivatedRoute) {
  let currentRoute = activatedRoute;
  let params = currentRoute.snapshot.params;

  while (currentRoute.children.length > 0) {
    currentRoute = currentRoute.children[currentRoute.children.length - 1];
    params = {
      ...params,
      ...currentRoute.snapshot.params,
    };
  }

  return params;
}

export function downloadFile(urlOrSource: string | Blob, name: string) {
  if (urlOrSource instanceof Blob) {
    urlOrSource = URL.createObjectURL(urlOrSource);
  }

  const a = document.createElement('a');
  a.download = name;
  a.href = urlOrSource;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
}

export function hasParentWithClass(element: HTMLElement, className: string) {
  let current = element as HTMLElement | null;

  while (current) {
    if (current.classList.contains(className)) {
      return true;
    }

    current = current.parentElement;
  }

  return false;
}

export function compareObjects<T>(obj1: T, obj2: T) {
  const difference: Partial<T> = {} as unknown as Partial<T>;

  for (const key in obj1) {
    if (Object.prototype.hasOwnProperty.call(obj1, key) && Object.prototype.hasOwnProperty.call(obj2, key)) {
      if (obj1[key] !== obj2[key]) {
        difference[key] = obj2[key];
      }
    }
  }

  return difference;
}

export function breadcrumb(items: AppBreadCrumbItem[]) {
  return {
    breadcrumb: items,
  };
}

export function filterNullValues<T extends object>(obj: T): T {
  return Object.fromEntries(Object.entries(obj).filter(([_, v]) => v != null)) as T;
}
