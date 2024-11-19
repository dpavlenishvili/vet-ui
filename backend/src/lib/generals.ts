import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';

import { baseApiUrl } from 'shared/src';

@Injectable({ providedIn: 'root' })
export class GeneralsService {
  private httpClient = inject(HttpClient);
  private baseUrl = baseApiUrl();
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
}
