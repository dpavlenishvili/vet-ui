import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { useBaseApiUrl } from '@vet/shared';

@Injectable({ providedIn: 'root' })
export class RolesService {
  private httpClient = inject(HttpClient);
  private baseUrl = useBaseApiUrl();
  /**
   * @description Returns list of user roles
   *
   * @tags Roles
   * @name Roles
   * @summary List of user roles
   * @request GET:/roles
   */
  roles = () =>
    this.httpClient.get<{
      name?: any;
    }>(`${this.baseUrl}/roles`);
}
