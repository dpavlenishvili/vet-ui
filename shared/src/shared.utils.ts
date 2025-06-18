import * as R from 'ramda';
import {
  AppBreadCrumbItem,
  DictionaryType,
  FilterOptionsMap, IdValue,
  Option,
  QueryParams,
  SelectOption, ValueLabel,
  WizardStepDefinition
} from './shared.types';
import { map, Observable } from 'rxjs';
import { ActivatedRoute, type Params } from '@angular/router';
import { ShortProgramAdmission } from '@vet/backend';

export const isEmptyOrUndefined = R.anyPass([R.isEmpty, R.isNil]);

export function withoutEmptyProperties<T extends object = Params>(params: T) {
  const filteredParams: Partial<T> = {};

  for (const [key, value] of Object.entries(params)) {
    if (isEmptyOrUndefined(value)) {
      continue;
    }

    filteredParams[key as keyof T] = value && typeof value === 'object' ? withoutEmptyProperties(value) : value;
  }

  return filteredParams as T;
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
        return (value === undefined || value === false)
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

export function filterEmptyValues<T extends object>(obj: T): T {
  return Object.fromEntries(Object.entries(obj).filter(([_, v]) => v != null && v.trim() !== '')) as T;
}


export function formatDate(date: Date): string {
  const d = new Date(date);
  const year = d.getFullYear();
  const month = ('0' + (d.getMonth() + 1)).slice(-2);
  const day = ('0' + d.getDate()).slice(-2);
  return `${year}-${month}-${day}`;
}

export function toFilterOptionsMap(
  filterData: Array<{ key?: string; values?: unknown; }>
): FilterOptionsMap {
  const pairs = filterData.filter(
    (filterItem): filterItem is {
      key: string;
      values: Array<{ name: string; value: string }>
    } => {
      return !!filterItem.key && Array.isArray(filterItem.values);
    },
  ).map(filterItem => [
    filterItem.key,
    filterItem.values.map((option) => ({
      label: option.name,
      value: option.value,
    }) as SelectOption<string>),
  ] as const);

  return new Map(pairs);
}

export function getCurrentStepIndex(
  steps: WizardStepDefinition[],
  requestedStepSegment: string | null | undefined,
): {
  requestedStepIndex: number;
  currentStepIndex: number;
} {
  if (!requestedStepSegment) {
    return {
      requestedStepIndex: 0,
      currentStepIndex: 0,
    };
  }


  // Takes step segment and maps it into step index
  // If a previous step of that index is valid - then we keep user on the requested step
  // If not, we move user to previous step, and so forth, until user reaches valid step
  // We move user to the first step if none of the steps were valid

  const pathToIndex = steps.reduce(
    (map, step, index) => {
      map[step.path] = index;
      return map;
    },
    {} as Record<string, number>,
  );

  const requestedStepIndex = pathToIndex[requestedStepSegment] ?? 0;

  let currentStepIndex = requestedStepIndex;

  while (currentStepIndex > 0) {
    const step = steps[currentStepIndex - 1];

    if (step.form().valid) {
      break;
    }

    --currentStepIndex;
  }

  return {
    requestedStepIndex,
    currentStepIndex,
  };
}

export function isValidIdValue(input: Partial<IdValue>): input is IdValue {
  return input.id != null && input.value != null
}

export function isValidDictionaryItem(input: Partial<DictionaryType>): input is DictionaryType {
  return input.id != null && input.name != null
}

export function mapIdValueToOption(idValue: IdValue): ValueLabel {
  return {
    value: idValue.id,
    label: idValue.value,
  };
}

export function mapDictionaryItemToOption(item: DictionaryType): ValueLabel {
  return {
    value: item.id,
    label: item.name,
  };
}

export function getUniqueItems<T, I>(items: T[], getUniqueId: (item: T) => I): T[] {
  return Array.from(
    new Map<I, T>(
      items.map(item => [getUniqueId(item), item] as const)
    ).values()
  );
}
