import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { useBaseApiUrl } from '@vet/shared';

@Injectable({ providedIn: 'root' })
export class GeneralsService {
  private httpClient = inject(HttpClient);
  private baseUrl = useBaseApiUrl();
  /**
   * @description Returns list of countries
   *
   * @tags Generals
   * @name GetCountriesList
   * @summary Get list of countries
   * @request GET:/general/countries
   */
  getCountriesList = () =>
    this.httpClient.get<{
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
    }>(`${this.baseUrl}/general/countries`);

  /**
   * @description Returns list of regions
   *
   * @tags Generals
   * @name GetRegionsList
   * @summary Get list of regions
   * @request GET:/general/regions
   */
  getRegionsList = () =>
    this.httpClient.get<{
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
    }>(`${this.baseUrl}/general/regions`);

  /**
   * @description Returns list of districts
   *
   * @tags Generals
   * @name GetDistrictsList
   * @summary Get list of districts
   * @request GET:/general/districts
   */
  getDistrictsList = () =>
    this.httpClient.get<{
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
         * District name in Georgian
         * @default "თბილისი"
         */
        name_ka?: string;
      }[];
    }>(`${this.baseUrl}/general/districts`);

  /**
   * @description Returns list of organisations
   *
   * @tags Generals
   * @name GetOrganisationsList
   * @summary Get list of organisations
   * @request GET:/general/organisations
   */
  getOrganisationsList = () =>
    this.httpClient.get<{
      data?: {
        /**
         * ID
         * @default 1
         */
        id?: number;
        /** Organisation name */
        name?: string;
      }[];
    }>(`${this.baseUrl}/general/organisations`);

  /**
   * @description Returns all configs
   *
   * @tags Generals
   * @name GetAllConfigs
   * @summary Get All configs
   * @request GET:/general/var
   */
  getAllConfigs = (query?: {
    /** Filter Key */
    key?: string;
  }) =>
    this.httpClient.get<{
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
    }>(`${this.baseUrl}/general/var`, { params: query as unknown as Record<string, string> });
}
