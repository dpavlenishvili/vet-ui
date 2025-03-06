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

  /**
   * No description
   *
   * @tags Commission
   * @name MotivationalCriteria
   * @summary List of motivational criterias
   * @request GET:/commission/criteria
   */
  motivationalCriteria = (query: {
    /** Admission ID */
    admission: number;
    /** Program ID */
    program: number;
  }) =>
    this.httpClient.get<{
      data?: {
        /** @example "1" */
        id?: number;
        /** @example "კრიტერიუმის სახელი" */
        name?: string;
        /** @example 0 */
        min_score?: number;
        /** @example 4 */
        max_score?: number;
        /** @example 3 */
        order?: number;
      }[];
    }>(`${this.baseUrl}/commission/criteria`, { params: query as unknown as Record<string, string> });

  /**
   * No description
   *
   * @tags Commission
   * @name SetScores
   * @summary Set motivational scores
   * @request POST:/commission/scores
   */
  setScores = (data: {
    /** ID of the admission */
    admission?: number;
    /** ID of the program */
    program?: number;
    /** Scores */
    scores?: {
      /**
       * Score ID
       * @example 1
       */
      criteria_id?: number;
      /**
       * Score value
       * @example 3
       */
      score?: number;
    }[];
  }) =>
    this.httpClient.post<{
      data?: {
        /** Indicates if the operation was successful */
        status?: boolean;
      };
    }>(`${this.baseUrl}/commission/scores`, data, {});
}
