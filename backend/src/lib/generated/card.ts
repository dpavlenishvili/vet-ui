import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { useBaseApiUrl, type HttpRequestOptions } from '@vet/shared';

import type { CardDataRes } from './data-contracts';

@Injectable({ providedIn: 'root' })
export class CardService {
  private httpClient = inject(HttpClient);
  private baseUrl = useBaseApiUrl();
  /**
   * @description Returns Exam card * * @tags Card
   * @name ExamCard
   * @summary Exam card
   * @request GET:/exam-card */

  examCard = (
    query?: {
      /** Admission ID */
      admission?: any;
      /** User PID */
      pid?: any;
    },
    options: HttpRequestOptions = {},
  ) => {
    return this.httpClient.get<CardDataRes>(`${this.baseUrl}/exam-card`, {
      params: query as unknown as Record<string, string>,
      ...options,
    });
  };
}
