import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { useBaseApiUrl } from '@vet/shared';

import type { AdmissionRes, LongTerm } from './data-contracts';

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
  admissionList = () => this.httpClient.get<AdmissionRes>(`${this.baseUrl}/admission`);

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
     * @default "1"
     */
    district_id?: number;
    /**
     * language code
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
     * (Spec Enviroment) if checked then pass value
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
  }) =>
    this.httpClient.post<{
      /**
       * status
       * @default true
       */
      status?: boolean;
    }>(`${this.baseUrl}/admission`, data, {});

  /**
   * @description Returns list of eligible Programs
   *
   * @tags Admission
   * @name EligibleProgramsList
   * @summary List of eligible programs
   * @request OPTIONS:/admission
   */
  eligibleProgramsList = () => this.httpClient.options<LongTerm>(`${this.baseUrl}/admission`);

  /**
   * @description Edit User admission on programs
   *
   * @tags Admission
   * @name EditAdmission
   * @summary Edit Admission
   * @request PUT:/admission/{id}
   */
  editAdmission = (
    id: number,
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
       * @default "1"
       */
      district_id?: number;
      /**
       * language code
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
       * (Spec Enviroment) if checked then pass value
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
       * Select main program_id
       * @default "1"
       */
      select?: number;
    },
  ) =>
    this.httpClient.put<{
      /**
       * status
       * @default true
       */
      status?: boolean;
    }>(`${this.baseUrl}/admission/${id}`, data, {});

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
}
