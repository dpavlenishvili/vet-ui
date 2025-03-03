import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { useBaseApiUrl } from '@vet/shared';

import type { PartnerRes } from './data-contracts';

@Injectable({ providedIn: 'root' })
export class PartnerService {
  private httpClient = inject(HttpClient);
  private baseUrl = useBaseApiUrl();
  /**
   * @description Returns list of partners
   *
   * @tags Partner
   * @name Partners
   * @summary List of partners
   * @request GET:/partners
   */
  partners = () => this.httpClient.get<PartnerRes>(`${this.baseUrl}/partners`);
}
