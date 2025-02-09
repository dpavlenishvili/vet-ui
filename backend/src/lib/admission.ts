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
  admissionList = (query?: {
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
    /**
     * PDF base 64 code
     * @default "base64://"
     */
    doc?: string;
    /**
     * (Spec Education) if checked then pass value
     * @default "ინტელექტუალური სირთულეები"
     */
    spec_edu?: string;
    /**
     * (Spec Education) if checked then pass value
     * @default "name of contact person"
     */
    e_name?: string;
    /**
     * (Spec Education) if checked then pass value
     * @default "phone number of contact person"
     */
    e_phone?: string;
    /**
     * (Spec Environment) if checked then pass value
     * @default "ლიფტი, პანდუსი"
     */
    spec_env?: string;
    /**
     * (Abroad pass any education) if checked then pass value
     * @default "base64://"
     */
    abroad_doc?: string;
    /**
     * (Occupied region pass any education) if checked then pass value
     * @default "base64://"
     */
    ocu_doc?: string;
    /**
     * Wizard step number
     * @default 1
     */
    step?: number;
    /**
     * Send 'registered' if user finishes the flow
     * @default "registered"
     */
    status?: string;
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
      /**
       * PDF base 64 code
       * @default "base64://"
       */
      doc?: string;
      /**
       * (Spec Education) if checked then pass value
       * @default "ინტელექტუალური სირთულეები"
       */
      spec_edu?: string;
      /**
       * (Spec Education) if checked then pass value
       * @default "name of contact person"
       */
      e_name?: string;
      /**
       * (Spec Education) if checked then pass value
       * @default "phone number of contact person"
       */
      e_phone?: string;
      /**
       * (Spec Environment) if checked then pass value
       * @default "ლიფტი, პანდუსი"
       */
      spec_env?: string;
      /**
       * (Abroad pass any education) if checked then pass value
       * @default "base64://"
       */
      abroad_doc?: string;
      /**
       * (Occupied region pass any education) if checked then pass value
       * @default "base64://"
       */
      ocu_doc?: string;
      /**
       * Wizard step number
       * @default 1
       */
      step?: number;
      /**
       * Send 'registered' if user finishes the flow
       * @default "registered"
       */
      status?: string;
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
  eligibleProgramsList = (id: any) => this.httpClient.options<LongTermsRes>(`${this.baseUrl}/admission/${id}`);
}
