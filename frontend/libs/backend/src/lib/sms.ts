import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { baseUrl } from '@vet/shared';

@Injectable({ providedIn: 'root' })
export class SmsService {
    private httpClient = inject(HttpClient);
    private baseUrl = baseUrl();
    /**
     * @description Send one time code to validate phone number
     *
     * @tags SMS
     * @name SendSmsCode
     * @summary Send one time code
     * @request GET:/sms/send
     */
    sendSmsCode = (query: {
        /**
         * Phone Number
         * @example "555123456"
         */
        phone: any;
    }) =>
        this.httpClient.get<{
            /**
             * Send sms code
             * @default true
             */
            status?: boolean;
        }>(`${this.baseUrl}/sms/send`, { params: query as unknown as Record<string, string> });

    /**
     * @description Validate SMS code
     *
     * @tags SMS
     * @name ValidateSms
     * @summary Validate SMS code
     * @request POST:/sms/validate
     */
    validateSms = (data: {
        /**
         * Phone number
         * @default "555123456"
         */
        phone: string;
        /**
         * SMS code
         * @default "1234"
         */
        sms_code: string;
    }) =>
        this.httpClient.post<{
            /**
             * Send sms code
             * @default true
             */
            status?: boolean;
        }>(`${this.baseUrl}/sms/validate`, data, {});
}
