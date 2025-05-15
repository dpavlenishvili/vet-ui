import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { useBaseApiUrl, type HttpRequestOptions } from '@vet/shared';

import type { StatRes } from './data-contracts';

@Injectable({ providedIn: 'root' })
export class StatsService {
  private httpClient = inject(HttpClient);
  private baseUrl = useBaseApiUrl();
  /**
   * @description Returns space statistic * * @tags Stats
   * @name Statistics
   * @summary Programs Statistics
   * @request GET:/stats */

  statistics = (
    query?: {
      /** Organisation ID */
      organisation?: any;
      /** Program ID */
      program?: any;
      /** Program Kind */
      kind?: any;
    },
    options: HttpRequestOptions = {},
  ) => {
    return this.httpClient.get<StatRes>(`${this.baseUrl}/stats`, {
      params: query as unknown as Record<string, string>,
      ...options,
    });
  };
}
