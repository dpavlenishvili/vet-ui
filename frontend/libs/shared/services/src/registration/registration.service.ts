import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { baseUrl } from '../../../src/lib/base-url.token';
import { CreateUser } from '@vet/shared/interfaces';

export interface User {
    firstName: string;
    gender: string;
    photo: string;
    birthDate: Date;
}

export interface Country {
    name: string;
    code: string;
}

@Injectable({ providedIn: 'root' })
export class RegistrationService {
    private http = inject(HttpClient);
    private baseUrl = baseUrl();

    registerUser(obj: CreateUser) {
        return this.http.post(`${this.baseUrl}/register`, obj);
    }

    checkUser(data: { personalNumber: string; lastName: string }) {
        return this.http.get<User>(`${this.baseUrl}/register/validate`, {
            params: {
                pid: data.personalNumber,
                last_name: data.lastName,
            },
        });
    }

    sendSMS(mobileNumber: string) {
        return this.http.get<{ status: boolean }>(`${this.baseUrl}/sms/send`, {
            params: {
                phone: mobileNumber,
            },
        });
    }

    validateMobile(smsCode: string, mobileNumber: string) {
        return this.http.post<{ status: boolean }>(`${this.baseUrl}/sms/validate`, {
            phone: mobileNumber,
            sms_code: smsCode,
        });
    }
}
