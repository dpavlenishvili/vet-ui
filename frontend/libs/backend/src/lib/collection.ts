import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { baseUrl } from '@vet/shared';

import { CollectionItemsRes } from './data-contracts';

@Injectable({ providedIn: 'root' })
export class CollectionService {
    private httpClient = inject(HttpClient);
    private baseUrl = baseUrl();
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
