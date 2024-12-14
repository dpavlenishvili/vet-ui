import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';

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
}
