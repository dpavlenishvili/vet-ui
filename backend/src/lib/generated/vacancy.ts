import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { useBaseApiUrl, type HttpRequestOptions } from '@vet/shared';

import type { VacancyCollectionRes, VacancyReq, VacancyResourceRes } from './data-contracts';

@Injectable({ providedIn: 'root' })
export class VacancyService {
  private httpClient = inject(HttpClient);
  private baseUrl = useBaseApiUrl();
  /**
   * No description * * @tags Vacancy
   * @name ApplyToVacancy
   * @summary Apply to the vacancy
   * @request POST:/vacancies/{vacancy}/apply */

  applyToVacancy = (vacancy: number, options: HttpRequestOptions = {}) => {
    return this.httpClient.post<{
      /** @example "true" */
      status?: boolean;
      /** @example "Vacancy applied successfully" */
      msg?: string;
    }>(`${this.baseUrl}/vacancies/${vacancy}/apply`, null, options);
  };
  /**
   * @description Handle the incoming request. * * @tags Vacancy
   * @name GetFavoriteVacancies
   * @summary List of favorite vacancies
   * @request GET:/vacancies/favorites */

  getFavoriteVacancies = (
    query?: {
      /** Page number */
      page?: any;
      /** Number of items per page */
      per_page?: any;
      /** Region ID */
      'filter[region_id]'?: any;
      /** District ID */
      'filter[district_id]'?: any;
      /** Institution */
      'filter[institution]'?: any;
      /** Position */
      'filter[position]'?: any;
      /** Modules #2 */
      'filter[modules][]'?: any;
    },
    options: HttpRequestOptions = {},
  ) => {
    return this.httpClient.get<VacancyCollectionRes>(`${this.baseUrl}/vacancies/favorites`, {
      params: query as unknown as Record<string, string>,
      ...options,
    });
  };
  /**
   * @description Handle the incoming request. * * @tags Vacancy
   * @name ValidateVacancyAgreement
   * @summary Validate the vacancy agreement
   * @request POST:/vacancies/agreement/validate */

  validateVacancyAgreement = (
    data: {
      /** @example 1 */
      hourly_pay_from?: number;
      /** @example 1 */
      hourly_pay_to?: number;
      /** @example "1" */
      hourly_workload_from?: string;
      /** @example "1" */
      hourly_workload_to?: string;
      /**
       * @format date
       * @example "2025-01-01"
       */
      publish_date?: string;
      /**
       * @format date
       * @example "2025-01-01"
       */
      deadline_date?: string;
    },
    query?: {
      /** Organisation code */
      organisation?: any;
    },
    options: HttpRequestOptions = {},
  ) => {
    return this.httpClient.post<void>(`${this.baseUrl}/vacancies/agreement/validate`, data, {
      params: query as unknown as Record<string, string>,
      ...options,
    });
  };
  /**
   * @description Display a listing of the resource. * * @tags Vacancy
   * @name GetVacancies
   * @summary Get all vacancies
   * @request GET:/vacancies */

  getVacancies = (
    query?: {
      /** Organisation code */
      organisation?: any;
      /** Page number */
      page?: any;
      /** Number of items per page */
      per_page?: any;
      /** Region ID */
      'filter[region_id]'?: any;
      /** District ID */
      'filter[district_id]'?: any;
      /** Institution */
      'filter[institution]'?: any;
      /** Position */
      'filter[position]'?: any;
      /** Modules #2 */
      'filter[modules][]'?: any;
    },
    options: HttpRequestOptions = {},
  ) => {
    return this.httpClient.get<VacancyCollectionRes>(`${this.baseUrl}/vacancies`, {
      params: query as unknown as Record<string, string>,
      ...options,
    });
  };
  /**
   * @description Store a newly created resource in storage. * * @tags Vacancy
   * @name CreateVacancy
   * @summary Store a newly created resource in storage.
   * @request POST:/vacancies */

  createVacancy = (data: VacancyReq, options: HttpRequestOptions = {}) => {
    return this.httpClient.post<VacancyResourceRes>(`${this.baseUrl}/vacancies`, data, options);
  };
  /**
   * @description Display the specified resource. * * @tags Vacancy
   * @name GetVacancy
   * @summary Display the specified resource.
   * @request GET:/vacancies/{vacancy} */

  getVacancy = (vacancy: number, options: HttpRequestOptions = {}) => {
    return this.httpClient.get<VacancyResourceRes>(`${this.baseUrl}/vacancies/${vacancy}`, options);
  };
  /**
   * @description Update the specified resource in storage. * * @tags Vacancy
   * @name UpdateVacancy
   * @summary Update the specified resource in storage.
   * @request PUT:/vacancies/{vacancy} */

  updateVacancy = (vacancy: number, data: VacancyReq, options: HttpRequestOptions = {}) => {
    return this.httpClient.put<VacancyResourceRes>(`${this.baseUrl}/vacancies/${vacancy}`, data, options);
  };
  /**
   * @description Remove the specified resource from storage. * * @tags Vacancy
   * @name DeleteVacancy
   * @summary Remove the specified resource from storage.
   * @request DELETE:/vacancies/{vacancy} */

  deleteVacancy = (vacancy: number, options: HttpRequestOptions = {}) => {
    return this.httpClient.delete<{
      /** @example "true" */
      status?: string;
    }>(`${this.baseUrl}/vacancies/${vacancy}`, options);
  };
  /**
   * @description Handle the incoming request. * * @tags Vacancy
   * @name ValidateVacancyDetails
   * @summary Validate the vacancy details
   * @request POST:/vacancies/details/validate */

  validateVacancyDetails = (
    data: {
      /** @example 1 */
      position_type?: number;
      /** @example "მასწავლებელი" */
      position?: string;
      /** @example true */
      teaching_professional_programs?: boolean;
      /** @example true */
      teaching_short_term_programs?: boolean;
      /** @example [1,2,3] */
      modules?: number[];
      /** @example [1,2,3] */
      programs?: number[];
      /** @example "თბილისი, სამთავროს ქუჩა 1" */
      address?: string;
      /** @example 1 */
      contact_person?: number;
      /**
       * @format date
       * @example "2025-01-01"
       */
      start_date?: string;
    },
    query?: {
      /** Organisation code */
      organisation?: any;
    },
    options: HttpRequestOptions = {},
  ) => {
    return this.httpClient.post<void>(`${this.baseUrl}/vacancies/details/validate`, data, {
      params: query as unknown as Record<string, string>,
      ...options,
    });
  };
  /**
   * @description Handle the incoming request. * * @tags Vacancy
   * @name ValidateVacancySelection
   * @summary Validate the vacancy selection
   * @request POST:/vacancies/selection/validate */

  validateVacancySelection = (
    data: {
      /** @example [1,2,3] */
      selection_stages?: number[];
      /** @example 1 */
      vacant_places?: number;
      /** @example 1 */
      work_format?: number;
      /** @example "პროგრამის გამოწვევა" */
      responsibilities?: string;
      /** @example "პროგრამის გამოწვევა" */
      basic_requirements?: string;
      /** @example "პროგრამის გამოწვევა" */
      essential_requirements?: string;
      /** @example "პროგრამის გამოწვევა" */
      optional_requirements?: string;
      /** @example "პროგრამის გამოწვევა" */
      additional_information?: string;
      /** @example true */
      obtaining_authorization?: boolean;
    },
    query?: {
      /** Organisation code */
      organisation?: any;
    },
    options: HttpRequestOptions = {},
  ) => {
    return this.httpClient.post<void>(`${this.baseUrl}/vacancies/selection/validate`, data, {
      params: query as unknown as Record<string, string>,
      ...options,
    });
  };
}
