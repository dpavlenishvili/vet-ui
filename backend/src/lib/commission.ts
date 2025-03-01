import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { useBaseApiUrl } from '@vet/shared';

import type { ProgramsWithCommissionsRes } from './data-contracts';

@Injectable({ providedIn: 'root' })
export class CommissionService {
  private httpClient = inject(HttpClient);
  private baseUrl = useBaseApiUrl();
  /**
   * @description list of organisation and commission memebers
   *
   * @tags Commission
   * @name ListOfOrganisationAndCommissionMemebers
   * @summary list of organisation and commission memebers
   * @request GET:/commission
   */
  listOfOrganisationAndCommissionMemebers = (query: {
    /** organisation ID */
    organisation: any;
  }) =>
    this.httpClient.get<ProgramsWithCommissionsRes>(`${this.baseUrl}/commission`, {
      params: query as unknown as Record<string, string>,
    });

  /**
   * @description Assigns a list of users (by their PIDs) to a specific program commission. The program must exist, and the number of users should be between 3 and 6.
   *
   * @tags Commission
   * @name CreateProgramCommission
   * @summary Assign commission member to a program
   * @request POST:/commission
   */
  createProgramCommission = (
    query: {
      /** organisation ID */
      organisation: any;
    },
    data: {
      /** ID of the program */
      program?: string;
      /** List of Personal IDs of users */
      pids?: string[];
    },
  ) =>
    this.httpClient.post<{
      data?: {
        /** Indicates if the operation was successful */
        status?: boolean;
      };
    }>(`${this.baseUrl}/commission`, data, { params: query as unknown as Record<string, string> });

  /**
   * @description Returns commission member
   *
   * @tags Commission
   * @name FindCommissionMember
   * @summary Find commision member
   * @request GET:/commission-check
   */
  findCommissionMember = (query: {
    /** Personal ID */
    pid: any;
    /** Name of commission member */
    name: any;
  }) =>
    this.httpClient.get<{
      data?: {
        /** Personal ID of the member */
        pid?: string;
        /** First name of the member */
        first_name?: string;
        /** Last name of the member */
        last_name?: string;
        /** Phone number of the member */
        phone?: string;
      };
    }>(`${this.baseUrl}/commission-check`, { params: query as unknown as Record<string, string> });
}
