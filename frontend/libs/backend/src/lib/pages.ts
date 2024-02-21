import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { baseUrl } from '@vet/shared';

import { PagesRes } from './data-contracts';

@Injectable({ providedIn: 'root' })
export class PagesService {
    private httpClient = inject(HttpClient);
    private baseUrl = baseUrl();
    /**
     * @description Returns list of pages
     *
     * @tags Pages
     * @name GetPagesList
     * @summary Get list of pages
     * @request GET:/pages
     */
    getPagesList = () => this.httpClient.get<PagesRes>(`${this.baseUrl}/pages`);
}
