import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { useBaseApiUrl, type HttpRequestOptions } from '@vet/shared';

@Injectable({ providedIn: 'root' })
export class GeneralsService {
  private httpClient = inject(HttpClient);
  private baseUrl = useBaseApiUrl();
  /**
   * @description Returns list of countries * * @tags Generals
   * @name GetCountriesList
   * @summary Get list of countries
   * @request GET:/general/countries */

  getCountriesList = (options: HttpRequestOptions = {}) => {
    return this.httpClient.get<{
      data?: {
        /**
         * Country code
         * @default "GE"
         */
        code?: string;
        /**
         * Country Name
         * @default "Georgia"
         */
        name?: string;
      }[];
    }>(`${this.baseUrl}/general/countries`, options);
  };
  /**
   * @description Returns list of regions * * @tags Generals
   * @name GetRegionsList
   * @summary Get list of regions
   * @request GET:/general/regions */

  getRegionsList = (options: HttpRequestOptions = {}) => {
    return this.httpClient.get<{
      data?: {
        /**
         * ID
         * @default 1
         */
        id?: number;
        /**
         * Region name
         * @default "Tbilisi"
         */
        name?: string;
      }[];
    }>(`${this.baseUrl}/general/regions`, options);
  };
  /**
   * @description Returns list of districts * * @tags Generals
   * @name GetDistrictsList
   * @summary Get list of districts
   * @request GET:/general/districts */

  getDistrictsList = (options: HttpRequestOptions = {}) => {
    return this.httpClient.get<{
      data?: {
        /**
         * ID
         * @default 1
         */
        id?: number;
        /**
         * District name
         * @default "Tbilisi"
         */
        name?: string;
        /**
         * Region id
         * @default 1
         */
        region_id?: number;
        /**
         * Region name
         * @default "აჭარა"
         */
        region_name?: string;
      }[];
    }>(`${this.baseUrl}/general/districts`, options);
  };
  /**
   * @description Returns list of organisations * * @tags Generals
   * @name GetOrganisationsList
   * @summary Get list of organisations
   * @request GET:/general/organisations */

  getOrganisationsList = (options: HttpRequestOptions = {}) => {
    return this.httpClient.get<{
      data?: {
        /**
         * ID
         * @default 1
         */
        id?: number;
        /** Organisation name */
        name?: string;
        /**
         * Region ID
         * @default 1
         */
        region_id?: number;
        /**
         * District ID
         * @default 1
         */
        district_id?: number;
      }[];
    }>(`${this.baseUrl}/general/organisations`, options);
  };
  /**
   * @description Returns all configs * * @tags Generals
   * @name GetAllConfigs
   * @summary Get All configs
   * @request GET:/general/var */

  getAllConfigs = (
    query?: {
      /** Filter Key */
      key?: string;
      /** Program Type */
      program_type?: string;
    },
    options: HttpRequestOptions = {},
  ) => {
    return this.httpClient.get<{
      institution_types?: {
        /** @example "1" */
        id?: string;
        /** @example "კერძო" */
        value?: string;
      }[];
      languages?: {
        /** @example "0" */
        id?: string;
        /** @example "ქართული" */
        value?: string;
      }[];
      education_levels?: {
        /** @example "2" */
        id?: string;
        /** @example "საბაზო" */
        value?: string;
      }[];
      program_types?: {
        /** @example "1" */
        id?: string;
        /** @example "დუალური" */
        value?: string;
      }[];
      selection_methods?: {
        /** @example "16" */
        id?: string;
        /** @example "რაოდენობრივი წიგნიერება" */
        value?: string;
      }[];
      selection_categories?: {
        /** @example "1" */
        id?: string;
        /** @example "ძირითადი შერჩევის მეთოდი" */
        value?: string;
      }[];
      financing_types?: {
        /** @example "1" */
        id?: string;
        /** @example "საბიუჯეტო" */
        value?: string;
      }[];
      institution_legal_types?: {
        /** @example "1" */
        id?: string;
        /** @example "ინდივიდუალური მეწარმე" */
        value?: string;
      }[];
    }>(`${this.baseUrl}/general/var`, { params: query as unknown as Record<string, string>, ...options });
  };
  /**
   * No description * * @tags Generals
   * @name Translate
   * @request GET:/general/translate */

  translate = (options: HttpRequestOptions = {}) => {
    return this.httpClient.get<string[]>(`${this.baseUrl}/general/translate`, options);
  };
}
