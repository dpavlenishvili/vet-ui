import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { useBaseApiUrl, type HttpRequestOptions } from '@vet/shared';

@Injectable({ providedIn: 'root' })
export class SmsService {
  private httpClient = inject(HttpClient);
  private baseUrl = useBaseApiUrl();
  /**
   * @description Send one time code to validate phone number * * @tags SMS
   * @name SendSmsCode
   * @summary Send one time code
   * @request GET:/sms/send */

  sendSmsCode = (
    query: {
      /**
       * Phone Number
       * @example "555123456"
       */
      phone: string;
    },
    options: HttpRequestOptions = {},
  ) => {
    return this.httpClient.get<{
      /**
       * Send sms code
       * @example true
       */
      status?: boolean;
    }>(`${this.baseUrl}/sms/send`, { params: query as unknown as Record<string, string>, ...options });
  };
  /**
   * @description Validate SMS code * * @tags SMS
   * @name ValidateSms
   * @summary Validate SMS code
   * @request POST:/sms/validate */

  validateSms = (
    data: {
      /**
       * Phone number
       * @example "555123456"
       */
      phone: string;
      /**
       * SMS code
       * @example "1234"
       */
      sms_code: string;
    },
    options: HttpRequestOptions = {},
  ) => {
    return this.httpClient.post<{
      /**
       * Send sms code
       * @example true
       */
      status?: boolean;
    }>(`${this.baseUrl}/sms/validate`, data, options);
  };
}
