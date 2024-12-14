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
                 * @default "1"
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
                 * @default "1"
                 */
                id?: number;
                /**
                 * Region name
                 * @default "Tbilisi"
                 */
                name?: string;
                /**
                 * Region name
                 * @default "Tbilisi"
                 */
                name_ka?: string;
            }[];
        }>(`${this.baseUrl}/general/districts`);
}
