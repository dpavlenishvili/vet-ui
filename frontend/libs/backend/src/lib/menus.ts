import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { baseUrl } from '@vet/shared';

@Injectable({ providedIn: 'root' })
export class MenusService {
    private httpClient = inject(HttpClient);
    private baseUrl = baseUrl();
    /**
     * @description Returns list of menus data
     *
     * @tags Pages
     * @name Menus
     * @summary List of menus
     * @request GET:/menus
     */
    menus = () => this.httpClient.get<void>(`${this.baseUrl}/menus`);
}
