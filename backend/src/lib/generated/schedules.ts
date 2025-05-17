import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { useBaseApiUrl, type HttpRequestOptions } from '@vet/shared';

import type { ScheduleRes } from './data-contracts';

@Injectable({ providedIn: 'root' })
export class SchedulesService {
  private httpClient = inject(HttpClient);
  private baseUrl = useBaseApiUrl();
  /**
   * @description Returns schedules and results * * @tags Schedules
   * @name Schedules
   * @summary Programs schedules and results
   * @request GET:/schedules */

  schedules = (
    query?: {
      /** Organisation code */
      organisation?: any;
      /** Filter programs */
      filter?: any;
    },
    options: HttpRequestOptions = {},
  ) => {
    return this.httpClient.get<ScheduleRes>(`${this.baseUrl}/schedules`, {
      params: query as unknown as Record<string, string>,
      ...options,
    });
  };
  /**
   * @description Set dates and address of exam * * @tags Schedules
   * @name SchedulesDates
   * @summary Set dates and address of exam
   * @request POST:/schedules/{id}/dates */

  schedulesDates = (
    id: string,
    data: {
      selection_method_id?: number;
      /** @format date-time */
      start_at?: string;
      address?: string;
    }[],
    options: HttpRequestOptions = {},
  ) => {
    return this.httpClient.post<{
      data?: {
        /** Indicates if the operation was successful */
        status?: boolean;
      };
    }>(`${this.baseUrl}/schedules/${id}/dates`, data, options);
  };
  /**
   * @description Set scores of exam * * @tags Schedules
   * @name SchedulesScores
   * @summary Set scores of exam
   * @request POST:/schedules/{id}/scores */

  schedulesScores = (
    id: string,
    data: {
      selection_method_id?: number;
      /** @format float */
      score?: number;
    }[],
    options: HttpRequestOptions = {},
  ) => {
    return this.httpClient.post<{
      data?: {
        /** Indicates if the operation was successful */
        status?: boolean;
      };
    }>(`${this.baseUrl}/schedules/${id}/scores`, data, options);
  };
  /**
   * @description Set granted status * * @tags Schedules
   * @name SchedulesGrant
   * @summary Set grant of exam
   * @request POST:/schedules/{id}/grant/{isGranted} */

  schedulesGrant = (id: string, isGranted: boolean, options: HttpRequestOptions = {}) => {
    return this.httpClient.post<{
      data?: {
        /** Indicates if the operation was successful */
        status?: boolean;
      };
    }>(`${this.baseUrl}/schedules/${id}/grant/${isGranted}`, null, options);
  };
}
