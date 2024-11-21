import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';

import { baseApiUrl } from 'shared/src';

import { User, UserReq, UserRes } from './data-contracts';

@Injectable({ providedIn: 'root' })
export class UsersService {
    private httpClient = inject(HttpClient);
    private baseUrl = baseApiUrl();
    /**
     * @description Returns list of users
     *
     * @tags Users
     * @name GetUserList
     * @summary Get list of users
     * @request GET:/users
     */
    getUserList = () =>
        this.httpClient.get<{
            data?: User[];
        }>(`${this.baseUrl}/users`);

    /**
     * @description Returns user data
     *
     * @tags Users
     * @name StoreUser
     * @summary Store new user
     * @request POST:/users
     */
    storeUser = (data: UserReq) => this.httpClient.post<UserRes>(`${this.baseUrl}/users`, data, {});

    /**
     * @description Returns user data
     *
     * @tags Users
     * @name GetUserById
     * @summary Get user information
     * @request GET:/users/{id}
     */
    getUserById = (id: number) => this.httpClient.get<UserRes>(`${this.baseUrl}/users/${id}`);

    /**
     * @description Returns updated user data
     *
     * @tags Users
     * @name UpdateUser
     * @summary Update existing user
     * @request PUT:/users/{id}
     */
    updateUser = (id: number, data: UserReq) => this.httpClient.put<UserRes>(`${this.baseUrl}/users/${id}`, data, {});

    /**
     * @description Deletes a record and returns no content
     *
     * @tags Users
     * @name DeleteUser
     * @summary Delete existing user
     * @request DELETE:/users/{id}
     */
    deleteUser = (id: number) => this.httpClient.delete<any>(`${this.baseUrl}/users/${id}`, {});
}
