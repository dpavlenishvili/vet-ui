import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { useBaseApiUrl, type HttpRequestOptions } from '@vet/shared';

import type { File, NonFormalRes, NonFormalsRes } from './data-contracts';

@Injectable({ providedIn: 'root' })
export class NonFormalService {
  private httpClient = inject(HttpClient);
  private baseUrl = useBaseApiUrl();
  /**
   * @description Returns list of non-formals * * @tags Non-formal
   * @name NonFormals
   * @summary List of non-formals
   * @request GET:/non-formals */

  nonFormals = (
    query?: {
      /** Filter by search name or isced description */
      'filters[search]'?: string;
      /** Filter by region ID */
      'filters[region]'?: number;
      /** Filter by district ID */
      'filters[district]'?: number;
      /** Filter by organisation ID */
      'filters[organisation]'?: number;
      /** Filter by non-formal ID */
      'filters[id]'?: number;
    },
    options: HttpRequestOptions = {},
  ) => {
    return this.httpClient.get<NonFormalsRes>(`${this.baseUrl}/non-formals`, {
      params: query as unknown as Record<string, string>,
      ...options,
    });
  };
  /**
   * @description Returns object of non-formal * * @tags Non-formal
   * @name NonFormal
   * @summary non-formals object
   * @request GET:/non-formals/{id} */

  nonFormal = (id: number, options: HttpRequestOptions = {}) => {
    return this.httpClient.get<NonFormalRes>(`${this.baseUrl}/non-formals/${id}`, options);
  };
  /**
   * @description Returns list of application for non-formal programs * * @tags Non-formal
   * @name NonFormalsApplications
   * @summary List of applications
   * @request GET:/non-formals/applications
   * @secure */

  nonFormalsApplications = (options: HttpRequestOptions = {}) => {
    return this.httpClient.get<{
      data?: {
        id?: number;
        education_level?: string;
        status?: {
          id?: string;
          /** @example "Draft" */
          name?: string;
          changed_at?: string;
        };
        program?: {
          isced?: string;
          isced_code?: string;
          registration_start_date?: string;
          registration_end_date?: string;
          organisation_name?: string;
        };
        can_edit?: boolean;
        can_delete?: boolean;
        can_change_program?: boolean;
      }[];
      links?: {
        /** @example "http://example.com?page=1" */
        first?: string;
        /** @example "http://example.com?page=10" */
        last?: string;
        /** @example null */
        prev?: string | null;
        /** @example "http://example.com?page=2" */
        next?: string | null;
      };
      meta?: {
        /** @example 1 */
        current_page?: number;
        /** @example 1 */
        from?: number;
        /** @example 10 */
        last_page?: number;
        links?: {
          url?: string | null;
          /** @example "1" */
          label?: string;
          /** @example true */
          active?: boolean;
        }[];
        /** @example "http://example.com" */
        path?: string;
        /** @example 15 */
        per_page?: number;
        /** @example 15 */
        to?: number;
        /** @example 150 */
        total?: number;
      };
    }>(`${this.baseUrl}/non-formals/applications`, options);
  };
  /**
   * @description Retrieve a specific non-formal application by ID * * @tags Non-formal
   * @name NonFormalsApplicationsShow
   * @summary Get non-formal application details
   * @request GET:/non-formals/applications/{id}
   * @secure */

  nonFormalsApplicationsShow = (id: number, options: HttpRequestOptions = {}) => {
    return this.httpClient.get<{
      data?: {
        /** @example 1 */
        id?: number;
        /** @example 123 */
        user_id?: number;
        /** @example 456 */
        non_formal_id?: number;
        status?: {
          id?: string;
          /** @example "Draft" */
          name?: string;
          changed_at?: string;
        };
        /** @example false */
        is_draft?: boolean;
        /** @example "To gain certification" */
        recognition_purpose?: string;
        /** @example "Detailed description of actions taken" */
        action_description?: string;
        /** @example "Self-taught" */
        who_taught_you?: string;
        /** @example "Self-taught" */
        who_taught_you_other?: string;
        /** @example "5" */
        experience_years?: string;
        /** @example "Online resources" */
        source_of_information?: string;
        /** @example "Online resources" */
        source_of_information_other?: string;
        /** @example true */
        like_your_job?: boolean;
        /**
         * @format date-time
         * @example "2023-01-01 12:00:00"
         */
        created_at?: string;
        /**
         * @format date-time
         * @example "2023-01-02 12:00:00"
         */
        updated_at?: string;
        /** @example true */
        can_change_program?: boolean;
        media?: {
          certificate?: {
            /** @example 1 */
            id?: number;
            /** @example "certificate.pdf" */
            file_name?: string;
            /** @example "https://example.com/certificate.pdf" */
            url?: string;
          }[];
          employment_contract?: {
            /** @example 2 */
            id?: number;
            /** @example "contract.pdf" */
            file_name?: string;
            /** @example "https://example.com/contract.pdf" */
            url?: string;
          }[];
          certificate_from_workplace?: {
            /** @example 3 */
            id?: number;
            /** @example "workplace_certificate.pdf" */
            file_name?: string;
            /** @example "https://example.com/workplace_certificate.pdf" */
            url?: string;
          }[];
          other?: {
            /** @example 4 */
            id?: number;
            /** @example "other_document.pdf" */
            file_name?: string;
            /** @example "https://example.com/other_document.pdf" */
            url?: string;
          }[];
        };
      };
    }>(`${this.baseUrl}/non-formals/applications/${id}`, options);
  };
  /**
   * @description Returns list of non-formals for registration * * @tags Non-formal
   * @name NonFormalsRegistration
   * @summary List of non-formals
   * @request GET:/non-formals/registration
   * @secure */

  nonFormalsRegistration = (
    query?: {
      /** Filter by search name or isced description */
      'filters[search]'?: string;
      /** Filter by region ID */
      'filters[region]'?: number;
      /** Filter by district ID */
      'filters[district]'?: number;
      /** Filter by organisation ID */
      'filters[organisation]'?: number;
      /** Filter by non-formal ID */
      'filters[id]'?: number;
    },
    options: HttpRequestOptions = {},
  ) => {
    return this.httpClient.get<{
      data?: {
        id?: number;
        isced?: string;
        isced_code?: string;
        registration_start_date?: string;
        registration_end_date?: string;
        organisation_name?: string;
      }[];
      links?: {
        /** @example "http://example.com?page=1" */
        first?: string;
        /** @example "http://example.com?page=10" */
        last?: string;
        /** @example null */
        prev?: string | null;
        /** @example "http://example.com?page=2" */
        next?: string | null;
      };
      meta?: {
        /** @example 1 */
        current_page?: number;
        /** @example 1 */
        from?: number;
        /** @example 10 */
        last_page?: number;
        links?: {
          url?: string | null;
          /** @example "1" */
          label?: string;
          /** @example true */
          active?: boolean;
        }[];
        /** @example "http://example.com" */
        path?: string;
        /** @example 15 */
        per_page?: number;
        /** @example 15 */
        to?: number;
        /** @example 150 */
        total?: number;
      };
      /**
       * List of registered non-formal IDs
       * @example [1]
       */
      registeredNonFormalIds?: number[];
    }>(`${this.baseUrl}/non-formals/registration`, {
      params: query as unknown as Record<string, string>,
      ...options,
    });
  };
  /**
   * @description Registers a user for a non-formal program or updates an existing draft application * * @tags Non-formal
   * @name NonFormalsRegistrationCreate
   * @summary Create or update non-formal registration
   * @request POST:/non-formals/registration/create
   * @secure */

  nonFormalsRegistrationCreate = (
    data: {
      /**
       * ID of the non-formal program
       * @example 1
       */
      non_formal_id?: number;
      /**
       * ID of the existing application (optional)
       * @example 123
       */
      application_id?: number | null;
    },
    options: HttpRequestOptions = {},
  ) => {
    return this.httpClient.post<{
      /**
       * Success message
       * @example "Registration successful"
       */
      message?: string;
      /** Registration data */
      data?: {
        /**
         * ID of the created or updated registration
         * @example 123
         */
        id?: number;
      };
    }>(`${this.baseUrl}/non-formals/registration/create`, data, options);
  };
  /**
   * @description Updates a non-formal application with survey data * * @tags Non-formal
   * @name NonFormalsSurvey
   * @summary Update non-formal survey
   * @request PUT:/non-formals/registration/{id}/survey
   * @secure */

  nonFormalsSurvey = (
    id: number,
    data: {
      /**
       * Education level ID
       * @example 1
       */
      education_level_id?: number;
      /**
       * Purpose of recognition
       * @example "დასაქმება, თვითდასაქმება"
       */
      recognition_purpose?: string;
      /**
       * Detailed description of actions taken
       * @maxLength 2000
       * @example "Participated in various training sessions and workshops to enhance my skills."
       */
      action_description?: string;
      /**
       * Who taught you
       * @example "ოჯახის წევრმა, მეგობარმა, სხვა"
       */
      who_taught_you?: string;
      /**
       * if Who taught you is other, please specify
       * @example "internet"
       */
      who_taught_you_other?: string;
      /**
       * Source of information
       * @example [1,2]
       */
      source_of_information?: string;
      /**
       * if source of information is other, please specify
       * @example "internet"
       */
      source_of_information_other?: string;
      /**
       * Do you like your job?
       * @example true
       */
      like_your_job?: boolean;
      /**
       * Years of experience
       * @example "5"
       */
      experience_years?: string;
    },
    options: HttpRequestOptions = {},
  ) => {
    return this.httpClient.put<{
      /**
       * Success message
       * @example "Registration successful"
       */
      message?: string;
      /** Updated survey data */
      data?: {
        /**
         * ID of the updated application
         * @example 123
         */
        id?: number;
      };
    }>(`${this.baseUrl}/non-formals/registration/${id}/survey`, data, options);
  };
  /**
   * @description Upload documents for a non-formal application * * @tags Non-formal
   * @name NonFormalsRegistrationDocuments
   * @summary Upload documents
   * @request POST:/non-formals/registration/{id}/documents
   * @secure */

  nonFormalsRegistrationDocuments = (
    id: number,
    data: {
      /**
       * Certificate file
       * @format binary
       */
      'certificate[]'?: File;
      /**
       * Employment contract file
       * @format binary
       */
      'employment_contract[]'?: File;
      /**
       * Workplace certificate file
       * @format binary
       */
      'certificate_from_workplace[]'?: File;
      /**
       * Other file (optional)
       * @format binary
       */
      'other[]'?: File;
    },
    options: HttpRequestOptions = {},
  ) => {
    return this.httpClient.post<{
      /**
       * Success message
       * @example "application updated successfully"
       */
      message?: string;
      /** Uploaded application data */
      data?: {
        /**
         * ID of the application
         * @example 123
         */
        id?: number;
      };
    }>(`${this.baseUrl}/non-formals/registration/${id}/documents`, data, options);
  };
  /**
   * @description Submit a non-formal application by marking it as not a draft * * @tags Non-formal
   * @name NonFormalsSubmit
   * @summary Submit non-formal application
   * @request PUT:/non-formals/registration/{id}/submit
   * @secure */

  nonFormalsSubmit = (id: number, options: HttpRequestOptions = {}) => {
    return this.httpClient.put<{
      /**
       * Success message
       * @example "application updated successfully"
       */
      message?: string;
      /** Submitted application data */
      data?: {
        /**
         * ID of the submitted application
         * @example 123
         */
        id?: number;
      };
    }>(`${this.baseUrl}/non-formals/registration/${id}/submit`, null, options);
  };
  /**
   * @description Delete a specific file from a non-formal applicatio * * @tags Non-formal
   * @name DeleteNonFormalApplicationFile
   * @summary Delete file from non-formal application
   * @request DELETE:/non-formals/applications/{applicationId}/file-delete/{fileId}
   * @secure */

  deleteNonFormalApplicationFile = (applicationId: number, fileId: number, options: HttpRequestOptions = {}) => {
    return this.httpClient.delete<{
      /**
       * Operation status
       * @example true
       */
      status?: boolean;
      /**
       * Success message
       * @example "File deleted successfully"
       */
      msg?: string;
    }>(`${this.baseUrl}/non-formals/applications/${applicationId}/file-delete/${fileId}`, options);
  };
  /**
   * @description Cancel a specific non-formal application * * @tags Non-formal
   * @name DeleteNonFormalApplication
   * @summary Cancel non-formal application
   * @request DELETE:/non-formals/applications/{applicationId}/delete
   * @secure */

  deleteNonFormalApplication = (applicationId: number, options: HttpRequestOptions = {}) => {
    return this.httpClient.delete<{
      /**
       * Operation status
       * @example true
       */
      status?: boolean;
      /**
       * Success message
       * @example "Application canceled successfully for user"
       */
      msg?: string;
    }>(`${this.baseUrl}/non-formals/applications/${applicationId}/delete`, options);
  };
}
