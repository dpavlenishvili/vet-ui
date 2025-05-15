import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { useBaseApiUrl, type HttpRequestOptions } from '@vet/shared';

import type { NonFormalRes, NonFormalsRes } from './data-contracts';

@Injectable({ providedIn: 'root' })
export class NonFormalService {
  private httpClient = inject(HttpClient);
  private baseUrl = useBaseApiUrl();
  /**
   * @description Returns list of non-formals * * @tags Non-formal
   * @name NonFormals
   * @summary List of non-formals
   * @request GET:/non-formals */

  nonFormals = (options: HttpRequestOptions = {}) => {
    return this.httpClient.get<NonFormalsRes>(`${this.baseUrl}/non-formals`, options);
  };
  /**
   * @description Returns object of non-formal * * @tags Non-formal
   * @name NonFormal
   * @summary non-formals object
   * @request GET:/non-formals/{id} */

  nonFormal = (id: number, options: HttpRequestOptions = {}) => {
    return this.httpClient.get<NonFormalRes>(`${this.baseUrl}/non-formals/${id}`, options);
  };
}
