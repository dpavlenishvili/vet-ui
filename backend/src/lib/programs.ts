import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { useBaseApiUrl } from '@vet/shared';

import type { LongTerm } from './data-contracts';

@Injectable({ providedIn: 'root' })
export class ProgramsService {
  private httpClient = inject(HttpClient);
  private baseUrl = useBaseApiUrl();
  /**
   * @description Returns list of long-term programs
   *
   * @tags Programs
   * @name LongTerm
   * @summary List of long-term programs
   * @request GET:/programs/long-term
   */
  longTerm = () => this.httpClient.get<LongTerm>(`${this.baseUrl}/programs/long-term`);

  /**
   * @description Returns list of short-term programs
   *
   * @tags Programs
   * @name ShortTerm
   * @summary List of short-term programs
   * @request GET:/programs/short-term
   */
  shortTerm = () => this.httpClient.get<LongTerm>(`${this.baseUrl}/programs/short-term`);
}
