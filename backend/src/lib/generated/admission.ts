import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { useBaseApiUrl, type HttpRequestOptions } from '@vet/shared';

import type { AdmissionRequest, AdmissionRes, AdmissionsRes, LongTermsRes } from './data-contracts';

@Injectable({ providedIn: 'root' })
export class AdmissionService {
  private httpClient = inject(HttpClient);
  private baseUrl = useBaseApiUrl();
  /**
   * @description Returns list of requested admissions * * @tags Admission
   * @name AdmissionList
   * @summary List of short-term programs
   * @request GET:/admission */

  admissionList = (
    query: {
      /** Admission Number */
      number?: any;
      /**
       * Registraction date range
       * @example "2025-01-01 - 2025-12-31"
       */
      date?: any;
      /**
       * Admission Status
       * @example "draft"
       */
      status?: any;
      /**
       * Admission search
       * @example "*"
       */
      search?: any;
      /**
       * Organisation code
       * @example "1234"
       */
      organisation?: any;
      /**
       * Selected role
       * @example "Default User"
       */
      role: any;
    },
    options: HttpRequestOptions = {},
  ) => {
    return this.httpClient.get<AdmissionsRes>(`${this.baseUrl}/admission`, {
      params: query as unknown as Record<string, string>,
      ...options,
    });
  };
  /**
   * @description User admission on programs * * @tags Admission
   * @name Admission
   * @summary User Admission
   * @request POST:/admission */

  admission = (data: AdmissionRequest, options: HttpRequestOptions = {}) => {
    return this.httpClient.post<AdmissionRes>(`${this.baseUrl}/admission`, data, options);
  };
  /**
   * @description Edit User admission on program * * @tags Admission
   * @name EditAdmission
   * @summary Edit Admission
   * @request PUT:/admission/{id} */

  editAdmission = (id: string, data: AdmissionRequest, options: HttpRequestOptions = {}) => {
    return this.httpClient.put<AdmissionRes>(`${this.baseUrl}/admission/${id}`, data, options);
  };
  /**
   * @description Delete User admission request * * @tags Admission
   * @name DeleteAdmission
   * @summary Delete Admission
   * @request DELETE:/admission/{id} */

  deleteAdmission = (id: number, options: HttpRequestOptions = {}) => {
    return this.httpClient.delete<{
      /**
       * status
       * @default true
       */
      status?: boolean;
    }>(`${this.baseUrl}/admission/${id}`, options);
  };
  /**
   * @description Returns list of eligible Programs * * @tags Admission
   * @name EligibleProgramsList
   * @summary List of eligible programs
   * @request OPTIONS:/admission/{id} */

  eligibleProgramsList = (
    id: any,
    query?: {
      /** Filter programs */
      filter?: any;
    },
    options: HttpRequestOptions = {},
  ) => {
    return this.httpClient.options<LongTermsRes>(`${this.baseUrl}/admission/${id}`, {
      params: query as unknown as Record<string, string>,
      ...options,
    });
  };
  /**
   * @description Check if user has active student status * * @tags Admission
   * @name StudentStatus
   * @summary Student status
   * @request GET:/admission/student-status */

  studentStatus = (options: HttpRequestOptions = {}) => {
    return this.httpClient.get<{
      /**
       * status
       * @default true
       */
      is_eligible?: boolean;
    }>(`${this.baseUrl}/admission/student-status`, options);
  };
  /**
   * @description Get user education level * * @tags Admission
   * @name EducationStatus
   * @summary Education status
   * @request GET:/admission/education-status */

  educationStatus = (options: HttpRequestOptions = {}) => {
    return this.httpClient.get<{
      /**
       * Education level
       * @default "ბაკალავრი"
       */
      level?: string;
      /**
       * Education level ID
       * @default 6
       */
      levelId?: number;
    }>(`${this.baseUrl}/admission/education-status`, options);
  };
}
