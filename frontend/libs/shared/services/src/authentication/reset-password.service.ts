import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { baseUrl } from '../../../src/lib/base-url.token';

export interface ResetPassword {
    status: boolean;
    msg: string;
}

@Injectable({ providedIn: 'root' })
export class ResetPasswordService {
    private http = inject(HttpClient);
    private baseUrl = baseUrl();

    resetPassword(data: { personalNumber: string; mobileNumber: string }) {
        return this.http.post<ResetPassword>(`${this.baseUrl}/auth/reset`, {
            pid: data.personalNumber,
            phone: data.mobileNumber,
        });
    }

    saveNewPassword(data: { personalNumber: string; mobileNumber: string; password: string; code: string }) {
        return this.http.post(`${this.baseUrl}/auth/reset/save`, {
            pid: data.personalNumber,
            phone: data.mobileNumber,
            password: data.password,
            code: data.code,
        });
    }
}
