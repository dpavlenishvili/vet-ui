import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { useBaseApiUrl, type HttpRequestOptions } from '@vet/shared';

import type { User, UserReq, UserRes, UserUpdateReq } from './data-contracts';

@Injectable({ providedIn: 'root' })
export class UsersService {
  private httpClient = inject(HttpClient);
  private baseUrl = useBaseApiUrl();
  /**
   * @description Returns list of users * * @tags Users
   * @name GetUserList
   * @summary Get list of users
   * @request GET:/users */

  getUserList = (options: HttpRequestOptions = {}) => {
    return this.httpClient.get<{
      data?: User[];
    }>(`${this.baseUrl}/users`, options);
  };
  /**
   * @description Returns user data * * @tags Users
   * @name StoreUser
   * @summary Store new user
   * @request POST:/users */

  storeUser = (data: UserReq, options: HttpRequestOptions = {}) => {
    return this.httpClient.post<UserRes>(`${this.baseUrl}/users`, data, options);
  };
  /**
   * @description Returns user data * * @tags Users
   * @name GetUserById
   * @summary Get user information
   * @request GET:/users/{id} */

  getUserById = (id: number, options: HttpRequestOptions = {}) => {
    return this.httpClient.get<UserRes>(`${this.baseUrl}/users/${id}`, options);
  };
  /**
   * @description Returns updated user data * * @tags Users
   * @name UpdateUser
   * @summary Update existing user
   * @request PUT:/users/{id} */

  updateUser = (id: number, data: UserUpdateReq, options: HttpRequestOptions = {}) => {
    return this.httpClient.put<UserRes>(`${this.baseUrl}/users/${id}`, data, options);
  };
  /**
   * @description Deletes a record and returns no content * * @tags Users
   * @name DeleteUser
   * @summary Delete existing user
   * @request DELETE:/users/{id} */

  deleteUser = (id: number, options: HttpRequestOptions = {}) => {
    return this.httpClient.delete<any>(`${this.baseUrl}/users/${id}`, options);
  };
}
