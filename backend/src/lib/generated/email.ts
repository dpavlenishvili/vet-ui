import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { useBaseApiUrl, type HttpRequestOptions } from '@vet/shared';

@Injectable({ providedIn: 'root' })
export class EmailService {
  private httpClient = inject(HttpClient);
  private baseUrl = useBaseApiUrl();
  /**
   * @description Send one time code to validate email address * * @tags Email
   * @name SendEmailCode
   * @summary Send one time email code
   * @request GET:/email/send */

  sendEmailCode = (
    query?: {
      /**
       * Email Address
       * @example "user@example.com"
       */
      email?: string;
      /** Auth temporary token */
      token?: string;
    },
    options: HttpRequestOptions = {},
  ) => {
    return this.httpClient.get<{
      /**
       * Send email code
       * @example true
       */
      status?: boolean;
    }>(`${this.baseUrl}/email/send`, {
      params: query as unknown as Record<string, string>,
      ...options,
    });
  };
  /**
   * @description check Email unique * * @tags Email
   * @name CheckEmailUnic
   * @request POST:/email/unique */

  checkEmailUnic = (
    data: {
      /**
       * Email address
       * @example "user@example.com"
       */
      email: string;
    },
    options: HttpRequestOptions = {},
  ) => {
    return this.httpClient.post<{
      /**
       * Email is available
       * @example true
       */
      status?: boolean;
    }>(`${this.baseUrl}/email/unique`, data, options);
  };
  /**
   * @description Validate Email code * * @tags Email
   * @name ValidateEmail
   * @summary Validate Email code
   * @request POST:/email/validate */

  validateEmail = (
    data: {
      /**
       * Email address
       * @example "user@example.com"
       */
      email: string;
      /**
       * Email code
       * @example "1234"
       */
      email_code: string;
    },
    options: HttpRequestOptions = {},
  ) => {
    return this.httpClient.post<{
      /**
       * Email code valid
       * @example true
       */
      status?: boolean;
    }>(`${this.baseUrl}/email/validate`, data, options);
  };
}
