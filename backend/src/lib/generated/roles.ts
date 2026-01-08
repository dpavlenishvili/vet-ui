import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { useBaseApiUrl, type HttpRequestOptions } from '@vet/shared';

@Injectable({ providedIn: 'root' })
export class RolesService {
  private httpClient = inject(HttpClient);
  private baseUrl = useBaseApiUrl();
  /**
   * @description Returns list of user roles * * @tags Roles
   * @name Roles
   * @summary List of user roles
   * @request GET:/roles */

  roles = (options: HttpRequestOptions = {}) => {
    return this.httpClient.get<
      {
        name?: string;
        roles?: string[];
        organisation?: string;
        permissions?: string[];
      }[]
    >(`${this.baseUrl}/roles`, options);
  };
}
