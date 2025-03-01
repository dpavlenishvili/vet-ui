import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { useBaseApiUrl } from '@vet/shared';

import type { AdmissionRes, AdmissionsRes, LongTermsRes } from './data-contracts';

@Injectable({ providedIn: 'root' })
export class AdmissionService {
  private httpClient = inject(HttpClient);
  private baseUrl = useBaseApiUrl();
  /**
   * @description Returns list of requested admissions
   *
   * @tags Admission
   * @name AdmissionList
   * @summary List of short-term programs
   * @request GET:/admission
   */
  admissionList = (query: {
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
     * Organisation code
     * @example "1234"
     */
    organisation?: any;
    /**
     * Selected role
     * @example "Default User"
     */
    role: any;
  }) =>
    this.httpClient.get<AdmissionsRes>(`${this.baseUrl}/admission`, {
      params: query as unknown as Record<string, string>,
    });

  /**
   * @description User admission on programs
   *
   * @tags Admission
   * @name Admission
   * @summary User Admission
   * @request POST:/admission
   */
  admission = (data: {
    /**
     * Program IDS
     * @default "[1,2,3]"
     */
    program_ids?: number[];
    /**
     * Education level
     * @default "Education"
     */
    education?: string;
    /**
     * District ID
     * @default 1
     */
    district_id?: number;
    /**
     * Language code
     * @default "KA"
     */
    language?: string;
    /** PDF base 64 code */
    doc?: string[];
    /** (Spec Education) if checked then pass value */
    spec_edu?: boolean;
    /**
     * (Spec Education) if checked then pass value
     * @default "name of contact person"
     */
    e_name?: string;
    /**
     * (Spec Education) if checked then pass value
     * @default "last name of contact person"
     */
    e_lastname?: string;
    /**
     * (Spec Education) if checked then pass value
     * @default "email of contact person"
     */
    e_email?: string;
    /**
     * (Spec Education) if checked then pass value
     * @default "phone number of contact person"
     */
    e_phone?: string;
    /**
     * (Spec Education) if checked then pass value
     * @default "special education description"
     */
    spe_description?: string;
    /**
     * (translate) if checked then pass value
     * @default "translate language"
     */
    translate?: string;
    /** (Spec Environment) If checked, then pass value for the environments like lift and ramp. */
    spec_env?: string[];
    /** (Abroad pass any education) if checked then pass value */
    abroad_doc?: string[];
    /** (Occupied region pass any education) if checked then pass value */
    ocu_doc?: string[];
    /**
     * Send 'registered' if user finishes the flow
     * @default "registered"
     */
    status?: string;
    /** (Spec Education) if checked then pass value */
    complete_edu_abroad?: boolean;
    /** (Spec Education) if checked then pass value */
    complete_base_edu_abroad?: boolean;
  }) => this.httpClient.post<AdmissionRes>(`${this.baseUrl}/admission`, data, {});

  /**
   * @description Edit User admission on programs
   *
   * @tags Admission
   * @name EditAdmission
   * @summary Edit Admission
   * @request PUT:/admission/{id}
   */
  editAdmission = (
    id: string,
    data: {
      /**
       * Program IDS
       * @default "[1,2,3]"
       */
      program_ids?: number[];
      /**
       * Education level
       * @default "Education"
       */
      education?: string;
      /**
       * District ID
       * @default 1
       */
      district_id?: number;
      /**
       * Language code
       * @default "KA"
       */
      language?: string;
      /** PDF base 64 code */
      doc?: string[];
      /** (Spec Education) if checked then pass value */
      spec_edu?: boolean;
      /**
       * (Spec Education) if checked then pass value
       * @default "name of contact person"
       */
      e_name?: string;
      /**
       * (Spec Education) if checked then pass value
       * @default "last name of contact person"
       */
      e_lastname?: string;
      /**
       * (Spec Education) if checked then pass value
       * @default "email of contact person"
       */
      e_email?: string;
      /**
       * (Spec Education) if checked then pass value
       * @default "phone number of contact person"
       */
      e_phone?: string;
      /**
       * (Spec Education) if checked then pass value
       * @default "special education description"
       */
      spe_description?: string;
      /**
       * (translate) if checked then pass value
       * @default "translate language"
       */
      translate?: string;
      /** (Spec Environment) If checked, then pass value for the environments like lift and ramp. */
      spec_env?: string[];
      /** (Abroad pass any education) if checked then pass value */
      abroad_doc?: string[];
      /** (Occupied region pass any education) if checked then pass value */
      ocu_doc?: string[];
      /**
       * Send 'registered' if user finishes the flow
       * @default "registered"
       */
      status?: string;
      /** (Spec Education) if checked then pass value */
      complete_edu_abroad?: boolean;
      /** (Spec Education) if checked then pass value */
      complete_base_edu_abroad?: boolean;
    },
  ) => this.httpClient.put<AdmissionRes>(`${this.baseUrl}/admission/${id}`, data, {});

  /**
   * @description Delete User admission request
   *
   * @tags Admission
   * @name DeleteAdmission
   * @summary Delete Admission
   * @request DELETE:/admission/{id}
   */
  deleteAdmission = (id: number) =>
    this.httpClient.delete<{
      /**
       * status
       * @default true
       */
      status?: boolean;
    }>(`${this.baseUrl}/admission/${id}`, {});

  /**
   * @description Returns list of eligible Programs
   *
   * @tags Admission
   * @name EligibleProgramsList
   * @summary List of eligible programs
   * @request OPTIONS:/admission/{id}
   */
  eligibleProgramsList = (
    id: any,
    query?: {
      /** Filter programs */
      filter?: any;
    },
  ) =>
    this.httpClient.options<LongTermsRes>(`${this.baseUrl}/admission/${id}`, {
      params: query as unknown as Record<string, string>,
    });

  /**
   * @description Check if user has active student status
   *
   * @tags Admission
   * @name StudentStatus
   * @summary Student status
   * @request GET:/admission/student-status
   */
  studentStatus = () =>
    this.httpClient.get<{
      /**
       * status
       * @default true
       */
      is_eligible?: boolean;
    }>(`${this.baseUrl}/admission/student-status`);

  /**
   * @description Get user education level
   *
   * @tags Admission
   * @name EducationStatus
   * @summary Education status
   * @request GET:/admission/education-status
   */
  educationStatus = () =>
    this.httpClient.get<{
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
    }>(`${this.baseUrl}/admission/education-status`);
}
