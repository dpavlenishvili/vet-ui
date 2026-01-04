import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { useBaseApiUrl, type HttpRequestOptions } from '@vet/shared/utils';

import type {
  AdmissionProgramReq,
  AdmissionRequest,
  AdmissionRes,
  AdmissionsRes,
  FinalResultsRes,
  LongTermsRes,
} from './data-contracts';

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
      /** First name */
      name?: any;
      /** Last name */
      lastname?: any;
      /** Personal ID */
      pid?: any;
      /** Spec status */
      specStatus?: any;
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
   * @description Returns list of requested admission programs * * @tags Admission
   * @name AdmissionProgramList
   * @summary List of admission programs
   * @request GET:/admission/{admissionId}/programs */

  admissionProgramList = (admissionId: any, options: HttpRequestOptions = {}) => {
    return this.httpClient.get<AdmissionProgramReq>(`${this.baseUrl}/admission/${admissionId}/programs`, options);
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
   * @description select program * * @tags Admission
   * @name SelectProgramAdmission
   * @summary select program
   * @request PUT:/admission/{admissionId}/select-program/{programId}/{select} */

  selectProgramAdmission = (admissionId: any, programId: any, select: boolean, options: HttpRequestOptions = {}) => {
    return this.httpClient.put<{
      /** @example "true" */
      status?: boolean;
      /** @example "The program is selected" */
      msg?: string;
    }>(`${this.baseUrl}/admission/${admissionId}/select-program/${programId}/${select}`, null, options);
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
    return this.httpClient.get<
      {
        /**
         * Education level
         * @example "საშუალო"
         */
        level?: string;
        /**
         * Education level ID
         * @example 4
         */
        levelId?: number;
      }[]
    >(`${this.baseUrl}/admission/education-status`, options);
  };
  /**
   * @description check if register available or not * * @tags Admission
   * @name CheckRegister
   * @summary Check if register available or not
   * @request GET:/admission/check-register */

  checkRegister = (options: HttpRequestOptions = {}) => {
    return this.httpClient.get<{
      /** Object containing registration availability information */
      data?: {
        /** Indicates whether registration is available based on the current date being within the registration period */
        is_available?: boolean;
      };
      /** Indicates the success status of the operation */
      status?: boolean;
      /** Message describing the operation outcome */
      msg?: string;
    }>(`${this.baseUrl}/admission/check-register`, options);
  };
  /**
   * @description Returns list of result * * @tags Admission
   * @name UserResults
   * @request GET:/admission/{id}/results */

  userResults = (id: any, options: HttpRequestOptions = {}) => {
    return this.httpClient.get<FinalResultsRes>(`${this.baseUrl}/admission/${id}/results`, options);
  };
}
