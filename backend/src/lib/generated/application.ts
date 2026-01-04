import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { useBaseApiUrl, type HttpRequestOptions } from '@vet/shared/utils';

import type { ApplicantCollectionRes, ApplicationReq, ApplicationResourceRes } from './data-contracts';

@Injectable({ providedIn: 'root' })
export class ApplicationService {
  private httpClient = inject(HttpClient);
  private baseUrl = useBaseApiUrl();
  /**
   * @description List of applicants. * * @tags Application
   * @name GetApplicants
   * @summary List of applicants
   * @request GET:/applicants */

  getApplicants = (
    query?: {
      /** All applicants */
      all_applicants?: boolean;
    },
    options: HttpRequestOptions = {},
  ) => {
    return this.httpClient.get<ApplicantCollectionRes>(`${this.baseUrl}/applicants`, {
      params: query as unknown as Record<string, string>,
      ...options,
    });
  };
  /**
   * @description Accept the terms on application. * * @tags Application
   * @name UpdateApplication
   * @summary Accept the terms on application
   * @request PUT:/applications */

  updateApplication = (options: HttpRequestOptions = {}) => {
    return this.httpClient.put<{
      status?: boolean;
      /** @example "Terms accepted successfully" */
      msg?: string;
    }>(`${this.baseUrl}/applications`, null, options);
  };
  /**
   * @description Handle the incoming request. * * @tags Application
   * @name StoreApplication
   * @summary Create or update the application
   * @request POST:/applications */

  storeApplication = (data: ApplicationReq, options: HttpRequestOptions = {}) => {
    return this.httpClient.post<ApplicationResourceRes>(`${this.baseUrl}/applications`, data, options);
  };
  /**
   * @description Destroy the application. * * @tags Application
   * @name DeleteApplication
   * @summary Destroy the application
   * @request DELETE:/applications */

  deleteApplication = (options: HttpRequestOptions = {}) => {
    return this.httpClient.delete<{
      /** @example true */
      status?: boolean;
      /** @example "Application deleted successfully" */
      msg?: string;
    }>(`${this.baseUrl}/applications`, options);
  };
}
