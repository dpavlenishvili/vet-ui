import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { useBaseApiUrl, type HttpRequestOptions } from '@vet/shared/utils';

import type { LongTermRes, LongTermsRes } from './data-contracts';

@Injectable({ providedIn: 'root' })
export class ProgramsService {
  private httpClient = inject(HttpClient);
  private baseUrl = useBaseApiUrl();
  /**
   * @description Returns list of programs * * @tags Programs
   * @name Programs
   * @summary List of programs
   * @request GET:/programs */

  programs = (
    query?: {
      /** Filter programs */
      filter?: any;
    },
    options: HttpRequestOptions = {},
  ) => {
    return this.httpClient.get<LongTermsRes>(`${this.baseUrl}/programs`, {
      params: query as unknown as Record<string, string>,
      ...options,
    });
  };
  /**
   * @description Returns object of program * * @tags Programs
   * @name Program
   * @summary Program object
   * @request GET:/programs/{id} */

  program = (id: number, options: HttpRequestOptions = {}) => {
    return this.httpClient.get<LongTermRes>(`${this.baseUrl}/programs/${id}`, options);
  };
}
