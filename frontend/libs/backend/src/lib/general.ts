import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { baseUrl } from '@vet/shared';

@Injectable({ providedIn: 'root' })
export class GeneralService {
    private httpClient = inject(HttpClient);
    private baseUrl = baseUrl();
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
