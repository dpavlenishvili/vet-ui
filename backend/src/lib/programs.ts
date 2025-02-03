import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { useBaseApiUrl } from '@vet/shared';

import type { LongTermRes, LongTermsRes } from './data-contracts';

@Injectable({ providedIn: 'root' })
export class ProgramsService {
  private httpClient = inject(HttpClient);
  private baseUrl = useBaseApiUrl();
  /**
   * @description Returns list of programs
   *
   * @tags Programs
   * @name Programs
   * @summary List of programs
   * @request GET:/programs
   */
  programs = () => this.httpClient.get<LongTermsRes>(`${this.baseUrl}/programs`);

  /**
   * @description Returns object of program
   *
   * @tags Programs
   * @name Program
   * @summary Program object
   * @request GET:/programs/{id}
   */
  program = (id: number) => this.httpClient.get<LongTermRes>(`${this.baseUrl}/programs/${id}`);
}
