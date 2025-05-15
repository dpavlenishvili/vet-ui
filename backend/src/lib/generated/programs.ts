import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { useBaseApiUrl, type HttpRequestOptions } from '@vet/shared';

import type { LongTermRes, LongTermsRes, ShortProgramRes, ShortProgramShowRes } from './data-contracts';

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
  /**
   * @description Returns list of short programs * * @tags Programs
   * @name ProgramsShort
   * @summary List of short programs
   * @request GET:/programs/short */

  programsShort = (
    query?: {
      /** Filter short programs */
      filter?: any;
    },
    options: HttpRequestOptions = {},
  ) => {
    return this.httpClient.get<ShortProgramRes>(`${this.baseUrl}/programs/short`, {
      params: query as unknown as Record<string, string>,
      ...options,
    });
  };
  /**
   * @description Returns object of short program * * @tags Programs
   * @name ProgramShort
   * @summary Program short object
   * @request GET:/programs/short/{id} */

  programShort = (id: number, options: HttpRequestOptions = {}) => {
    return this.httpClient.get<ShortProgramShowRes>(`${this.baseUrl}/programs/short/${id}`, options);
  };
}
