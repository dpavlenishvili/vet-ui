import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { useBaseApiUrl } from '@vet/shared';

import type { UserReq, UserRes } from './data-contracts';

@Injectable({ providedIn: 'root' })
export class RegisterService {
  private httpClient = inject(HttpClient);
  private baseUrl = useBaseApiUrl();
  /**
   * @description Validate person by Personal Id and Last name
   *
   * @tags Register
   * @name ValidatePerson
   * @summary Validate Person
   * @request GET:/register/validate
   */
  validatePerson = (query: {
    /**
     * Personal ID
     * @example "01000000000"
     */
    pid: any;
    /**
     * Last name
     * @example "Doe"
     */
    last_name: any;
  }) =>
    this.httpClient.get<{
      /**
       * First name
       * @default "John"
       */
      firstName?: string;
      /**
       * Birth date
       * @default "1999-12-31"
       */
      birthDate?: string;
      /**
       * Gender
       * @default "male"
       */
      gender?: string;
      /**
       * photo of user
       * @default "base64 string"
       */
      photo?: string;
    }>(`${this.baseUrl}/register/validate`, { params: query as unknown as Record<string, string> });

  /**
   * @description Returns user data
   *
   * @tags Register
   * @name Register
   * @summary Register user
   * @request POST:/register
   */
  register = (data: UserReq) => this.httpClient.post<UserRes>(`${this.baseUrl}/register`, data, {});
}
