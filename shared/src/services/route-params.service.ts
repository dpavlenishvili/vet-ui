import { Injectable } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { map, Observable, shareReplay } from 'rxjs';
import { QueryParams } from '../shared.types';
import { parseNestedObjects, stringifyNestedObjects, withoutEmptyProperties } from '../shared.utils';

@Injectable({ providedIn: 'root' })
export class RouteParamsService {
  private readonly queryParams$: Observable<Params>;

  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
  ) {
    this.queryParams$ = this.activatedRoute.queryParams.pipe(
      map((params) => parseNestedObjects(params)),
      shareReplay(1),
    );
  }

  get<T extends Params>(): Observable<T> {
    return this.queryParams$ as Observable<T>;
  }

  getSnapshot<T extends Params>(): T {
    return parseNestedObjects(this.activatedRoute.snapshot.queryParams) as T;
  }

  update(params: QueryParams, replaceUrl = false, preserveFragment = true): void {
    const currentParams = this.activatedRoute.snapshot.queryParams;

    const newParams = {
      ...currentParams,
      ...stringifyNestedObjects(withoutEmptyProperties(params)),
    };

    void this.router.navigate([], {
      queryParams: newParams,
      replaceUrl,
      preserveFragment,
      queryParamsHandling: null,
    });
  }

  reset(paramKeys: string[] = [], replaceUrl = false): void {
    if (paramKeys.length === 0) {
      void this.router.navigate([], {
        queryParams: {},
        replaceUrl,
      });
      return;
    }

    const currentParams = { ...this.activatedRoute.snapshot.queryParams };

    paramKeys.forEach((key) => {
      delete currentParams[key];
    });

    void this.router.navigate([], {
      queryParams: currentParams,
      replaceUrl,
    });
  }

  merge(params: QueryParams, keys: string[] = [], replaceUrl = false): void {
    const currentParams = this.activatedRoute.snapshot.queryParams;
    let paramsToMerge = params;

    if (keys.length > 0) {
      paramsToMerge = keys.reduce((acc, key) => {
        if (key in params) {
          acc[key] = params[key];
        }
        return acc;
      }, {} as QueryParams);
    }

    const newParams = {
      ...currentParams,
      ...stringifyNestedObjects(withoutEmptyProperties(paramsToMerge)),
    };

    void this.router.navigate([], {
      queryParams: newParams,
      replaceUrl,
    });
  }
}
