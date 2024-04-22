import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { baseUrl } from '@vet/shared';

import { CollectionItemsRes, PagesRes } from './data-contracts';

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

    /**
     * @description Returns list of menus data
     *
     * @tags Pages
     * @name Menus
     * @summary List of menus
     * @request GET:/menus
     */
    menus = () => this.httpClient.get<void>(`${this.baseUrl}/menus`);

    /**
     * @description Returns items of page colections
     *
     * @tags Pages
     * @name CollectionsItems
     * @summary Get collection items
     * @request GET:/collection/{id}
     */
    collectionsItems = (id: number) => this.httpClient.get<CollectionItemsRes>(`${this.baseUrl}/collection/${id}`);
}
