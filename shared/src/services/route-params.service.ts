import { Injectable } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { map, Observable } from 'rxjs';
import { QueryParams } from '../shared.types';
import { parseNestedObjects, stringifyNestedObjects, withoutEmptyProperties } from '../shared.utils';

@Injectable({ providedIn: 'root' })
export class RouteParamsService {
  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
  ) {}

  get<T extends Params>(): Observable<T> {
    return this.activatedRoute.queryParams.pipe(map((queryParams) => parseNestedObjects(queryParams) as T));
  }

  getSnapshot<T extends Params>(): T {
    return this.activatedRoute.snapshot.queryParams as T;
  }

  update(filters: QueryParams): void {
    console.log('this.activatedRoute.snapshot.queryParams', this.activatedRoute.snapshot.queryParams);
    console.log('stringifyNestedObjects(withoutEmptyProperties(filters))', filters);
    void this.router.navigate([], {
      queryParams: {
        ...this.activatedRoute.snapshot.queryParams,
        ...stringifyNestedObjects(withoutEmptyProperties(filters)),
      },
    });
  }
}
