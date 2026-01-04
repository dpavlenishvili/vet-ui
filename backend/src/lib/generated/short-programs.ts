import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { useBaseApiUrl, type HttpRequestOptions } from '@vet/shared/utils';

import type {
  ApplicationRequest,
  ProgramShortAdmissionRes,
  ProgramShortApplicationForOrganisationRes,
  ProgramShortApplicationRes,
  ShortProgramRes,
  ShortProgramShowRes,
} from './data-contracts';

@Injectable({ providedIn: 'root' })
export class ShortProgramsService {
  private httpClient = inject(HttpClient);
  private baseUrl = useBaseApiUrl();
  /**
   * @description Returns list of short program admissions * * @tags Short programs
   * @name ProgramsShortAdmissions
   * @summary List of short program admissions
   * @request GET:/short-programs/admissions
   * @secure */

  programsShortAdmissions = (
    query?: {
      /** Filter short program admissions */
      filter?: any;
    },
    options: HttpRequestOptions = {},
  ) => {
    return this.httpClient.get<ProgramShortAdmissionRes>(`${this.baseUrl}/short-programs/admissions`, {
      params: query as unknown as Record<string, string>,
      ...options,
    });
  };
  /**
   * @description Returns list of short program applications * * @tags Short programs
   * @name ProgramsShortApplications
   * @summary List of short program applications
   * @request GET:/short-programs/applications
   * @secure */

  programsShortApplications = (
    query?: {
      /** Filter short program applications */
      filter?: any;
    },
    options: HttpRequestOptions = {},
  ) => {
    return this.httpClient.get<ProgramShortApplicationRes>(`${this.baseUrl}/short-programs/applications`, {
      params: query as unknown as Record<string, string>,
      ...options,
    });
  };
  /**
   * No description * * @tags Short programs
   * @name ProgramsShortApplicationsStore
   * @summary Register user for short program admission
   * @request POST:/short-programs/applications
   * @secure */

  programsShortApplicationsStore = (data: ApplicationRequest, options: HttpRequestOptions = {}) => {
    return this.httpClient.post<{
      /** @example true */
      status?: boolean;
      /** @example "Application submitted successfully" */
      msg?: string;
    }>(`${this.baseUrl}/short-programs/applications`, data, options);
  };
  /**
   * @description Destroy the application. * * @tags Short programs
   * @name DeleteShortProgramApplication
   * @summary Destroy the short program application
   * @request DELETE:/short-programs/applications/{shortProgramApplicationId}
   * @secure */

  deleteShortProgramApplication = (shortProgramApplicationId: number, options: HttpRequestOptions = {}) => {
    return this.httpClient.delete<{
      /** @example true */
      status?: boolean;
      /** @example "Application deleted successfully" */
      msg?: string;
    }>(`${this.baseUrl}/short-programs/applications/${shortProgramApplicationId}`, options);
  };
  /**
   * @description Returns list of short program applications for organisation * * @tags Short programs
   * @name ProgramsShortApplicationsForOrganisation
   * @summary List of short program applications
   * @request GET:/short-programs/applications/for-organisation
   * @secure */

  programsShortApplicationsForOrganisation = (
    query: {
      /** Filter short program applications for organisation */
      organisation_id: any;
      /** Filter short program applications for program_id */
      program_id: any;
      /** Filter short program applications for program_admission_id */
      program_admission_id: any;
    },
    options: HttpRequestOptions = {},
  ) => {
    return this.httpClient.get<ProgramShortApplicationForOrganisationRes>(
      `${this.baseUrl}/short-programs/applications/for-organisation`,
      { params: query as unknown as Record<string, string>, ...options },
    );
  };
  /**
   * @description Returns list of short program organisations * * @tags Short programs
   * @name ProgramsShortOrganisations
   * @summary List of short program organisations
   * @request GET:/short-programs/organisations
   * @secure */

  programsShortOrganisations = (options: HttpRequestOptions = {}) => {
    return this.httpClient.get<{
      data?: {
        id?: number;
        name?: string;
      }[];
    }>(`${this.baseUrl}/short-programs/organisations`, options);
  };
  /**
   * @description Returns list of short programs by organisation * * @tags Short programs
   * @name ProgramsShortByOrganisation
   * @summary List of short programs by organisation
   * @request GET:/short-programs/by-organisation/{organisation}
   * @secure */

  programsShortByOrganisation = (organisation: string, options: HttpRequestOptions = {}) => {
    return this.httpClient.get<{
      data?: {
        id?: number;
        name?: string;
      }[];
    }>(`${this.baseUrl}/short-programs/by-organisation/${organisation}`, options);
  };
  /**
   * @description Returns list of short admissions by program * * @tags Short programs
   * @name ProgramsShortAdmissionsByProgram
   * @summary List of short admissions by program
   * @request GET:/short-programs/{program}/admissions
   * @secure */

  programsShortAdmissionsByProgram = (program: string, options: HttpRequestOptions = {}) => {
    return this.httpClient.get<{
      data?: {
        id?: number;
        name?: string;
      }[];
    }>(`${this.baseUrl}/short-programs/${program}/admissions`, options);
  };
  /**
   * @description Returns list of short programs * * @tags Short programs
   * @name ProgramsShort
   * @summary List of short programs
   * @request GET:/short-programs */

  programsShort = (
    query?: {
      /** Filter short programs */
      filter?: any;
    },
    options: HttpRequestOptions = {},
  ) => {
    return this.httpClient.get<ShortProgramRes>(`${this.baseUrl}/short-programs`, {
      params: query as unknown as Record<string, string>,
      ...options,
    });
  };
  /**
   * @description Returns object of short program * * @tags Short programs
   * @name ProgramShort
   * @summary Program short object
   * @request GET:/short-programs/{id} */

  programShort = (id: number, options: HttpRequestOptions = {}) => {
    return this.httpClient.get<ShortProgramShowRes>(`${this.baseUrl}/short-programs/${id}`, options);
  };
  /**
   * @description Returns list of short program organisations with stats * * @tags Short programs
   * @name ShortProgramsStats
   * @summary List of short program organisations
   * @request GET:/short-programs-stats */

  shortProgramsStats = (options: HttpRequestOptions = {}) => {
    return this.httpClient.get<{
      data?: {
        id?: number;
        name?: string;
        registered_count?: number;
      }[];
    }>(`${this.baseUrl}/short-programs-stats`, options);
  };
  /**
   * @description Returns list of short program by organisation with stats * * @tags Short programs
   * @name ShortProgramsStatsOrganisation
   * @summary List of short program by organisation
   * @request GET:/short-programs-stats/{organisation}/programs */

  shortProgramsStatsOrganisation = (organisation: string, options: HttpRequestOptions = {}) => {
    return this.httpClient.get<{
      data?: {
        id?: number;
        program_name?: string;
        program_kind?: string | null;
        organisation_name?: string;
        address?: string | null;
        partners?: string | null;
        max_number_of_students?: number | null;
        registered_count?: number;
      }[];
    }>(`${this.baseUrl}/short-programs-stats/${organisation}/programs`, options);
  };
  /**
   * @description Returns list of stats for short program admissions by program * * @tags Short programs
   * @name ShortProgramsStatsAdmissions
   * @summary Returns list of stats for short program admissions by program
   * @request GET:/short-programs-stats/{program}/admissions */

  shortProgramsStatsAdmissions = (program: string, options: HttpRequestOptions = {}) => {
    return this.httpClient.get<{
      data?: {
        id?: number;
        registration_start_date?: string;
        registration_end_date?: string;
        study_start_date?: string;
        max_number_of_students?: number | null;
        registered_count?: number;
      }[];
    }>(`${this.baseUrl}/short-programs-stats/${program}/admissions`, options);
  };
}
