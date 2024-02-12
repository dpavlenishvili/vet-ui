import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { baseUrl } from '../../../src/lib/base-url.token';

export interface Authentication {
    access_token: string;
    token_type: string;
    expires_in: number;
}

export interface TwoStepAuthentication {
    status: boolean;
    msg: string;
    phone_mask: string;
}

@Injectable({ providedIn: 'root' })
export class AuthenticationService {
    private http = inject(HttpClient);
    private baseUrl = baseUrl();

    authenticate(data: { personalNumber: string; password: string }) {
        return this.http.post<Authentication | TwoStepAuthentication>(`${this.baseUrl}/auth/login`, {
            pid: data.personalNumber,
            password: data.password,
        });
    }

    verifyMobile(data: { personalNumber: string; password: string; code: string }) {
        return this.http.post<Authentication>(`${this.baseUrl}/auth/login/2fa`, {
            pid: data.personalNumber,
            password: data.password,
            code: data.code,
        });
    }
}
