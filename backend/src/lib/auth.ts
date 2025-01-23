import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { useBaseApiUrl } from '@vet/shared';

import type {
  LoginRequestBody,
  UserLogin2FaResponseBody,
  UserLoginResponseBody,
  UserRes,
  ValidateCodeRequestBody,
} from './data-contracts';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private httpClient = inject(HttpClient);
  private baseUrl = useBaseApiUrl();
  /**
   * No description
   *
   * @tags Auth
   * @name LoginUser
   * @summary User authentication
   * @request POST:/auth/login
   */
  loginUser = (data: LoginRequestBody) =>
    this.httpClient.post<UserLoginResponseBody | UserLogin2FaResponseBody>(`${this.baseUrl}/auth/login`, data, {});

  /**
   * No description
   *
   * @tags Auth
   * @name Validate2FaCode
   * @summary User authentication with 2fa code
   * @request POST:/auth/login/2fa
   */
  validate2FaCode = (data: ValidateCodeRequestBody) =>
    this.httpClient.post<UserLoginResponseBody>(`${this.baseUrl}/auth/login/2fa`, data, {});

  /**
   * No description
   *
   * @tags Auth
   * @name GetUser
   * @summary Get user info
   * @request GET:/auth/me
   */
  getUser = () => this.httpClient.get<UserRes>(`${this.baseUrl}/auth/me`);

  /**
   * No description
   *
   * @tags Auth
   * @name LogoutUser
   * @summary Logout user
   * @request DELETE:/auth/logout
   */
  logoutUser = () =>
    this.httpClient.delete<{
      /**
       * Status
       * @default "true"
       */
      status?: boolean;
      /**
       * Successfully logged out
       * @default "Successfully logged out"
       */
      msg?: string;
    }>(`${this.baseUrl}/auth/logout`, {});

  /**
   * No description
   *
   * @tags Auth
   * @name RefreshToken
   * @summary Refresh token
   * @request POST:/auth/refresh
   */
  refreshToken = () => this.httpClient.post<UserLoginResponseBody>(`${this.baseUrl}/auth/refresh`, null, {});

  /**
   * No description
   *
   * @tags Auth
   * @name ChangePassword
   * @summary Change password for user
   * @request POST:/auth/password
   */
  changePassword = (data: {
    /**
     * Personal ID
     * @default "010000000000"
     */
    pid?: string;
    /**
     * Password
     * @default "password"
     */
    password?: string;
    /**
     * New Password
     * @default "password"
     */
    new_password?: string;
    /**
     * Password confirmation
     * @default "password"
     */
    password_confirmation?: string;
  }) =>
    this.httpClient.post<{
      /**
       * Status
       * @default "true"
       */
      status?: boolean;
      /**
       * Password updated
       * @default "Password updated"
       */
      msg?: string;
    }>(`${this.baseUrl}/auth/password`, data, {});

  /**
   * No description
   *
   * @tags Auth
   * @name InitForgetPassword
   * @summary Init forget password for user
   * @request POST:/auth/reset
   */
  initForgetPassword = (data: {
    /**
     * Personal ID
     * @default "010000000000"
     */
    pid?: string;
    /**
     * Phone Number
     * @default "555123456"
     */
    phone?: string;
  }) =>
    this.httpClient.post<{
      /**
       * Status
       * @default "true"
       */
      status?: boolean;
      /**
       * Sms code sent
       * @default "Password updated"
       */
      msg?: string;
    }>(`${this.baseUrl}/auth/reset`, data, {});

  /**
   * No description
   *
   * @tags Auth
   * @name ResetPassword
   * @summary Reset password for user
   * @request POST:/auth/reset/save
   */
  resetPassword = (data: {
    /**
     * Personal ID
     * @default "010000000000"
     */
    pid?: string;
    /**
     * Phone Number
     * @default "555123456"
     */
    phone?: string;
    /**
     * Sms code
     * @default "1234"
     */
    code?: string;
    /**
     * New Password
     * @default "password"
     */
    password?: string;
  }) =>
    this.httpClient.post<{
      /**
       * Status
       * @default "true"
       */
      status?: boolean;
      /**
       * Password updated
       * @default "Password updated"
       */
      msg?: string;
    }>(`${this.baseUrl}/auth/reset/save`, data, {});

  /**
   * No description
   *
   * @tags Auth
   * @name ResetPasswordByToken
   * @summary Reset password by token for user
   * @request POST:/auth/password/change
   */
  resetPasswordByToken = (data: {
    /**
     * Token
     * @default "qwertyuiopasdfdsgfdhgfjhgkj..."
     */
    token?: string;
    /**
     * New Password
     * @default "password"
     */
    password?: string;
  }) =>
    this.httpClient.post<{
      /**
       * Status
       * @default "true"
       */
      status?: boolean;
      /**
       * Password updated
       * @default "Password updated"
       */
      msg?: string;
    }>(`${this.baseUrl}/auth/password/change`, data, {});
}
