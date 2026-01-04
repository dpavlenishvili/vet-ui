import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { useBaseApiUrl, type HttpRequestOptions } from '@vet/shared/utils';

import type { OpenhouseCollectionRes } from './data-contracts';

@Injectable({ providedIn: 'root' })
export class OpenhouseService {
  private httpClient = inject(HttpClient);
  private baseUrl = useBaseApiUrl();
  /**
   * @description Display a listing of the resource. * * @tags Openhouse
   * @name De8926F7953Be18345553Adb9D91F
   * @summary Get all openhouses
   * @request GET:/openhouses */

  de8926F7953Be18345553Adb9D91F = (
    query?: {
      /** Page number */
      page?: any;
      /** Number of items per page */
      per_page?: any;
      /** Search in title or description */
      query?: any;
      /** Organisation ID */
      organisation_id?: any;
      /** Search between start_at and end_at */
      in_date?: any;
      /** Address of the event */
      'organisation.address'?: any;
    },
    options: HttpRequestOptions = {},
  ) => {
    return this.httpClient.get<OpenhouseCollectionRes>(`${this.baseUrl}/openhouses`, {
      params: query as unknown as Record<string, string>,
      ...options,
    });
  };
}
