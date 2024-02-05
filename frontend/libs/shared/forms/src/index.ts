// TODO Move custom pattern validator to validators library
import { AbstractControl, ValidatorFn } from '@angular/forms';

export function customPatternValidator(pattern: string | RegExp, error: { [key: string]: boolean }): ValidatorFn {
    const regex = new RegExp(pattern);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return (control: AbstractControl): { [key: string]: any } | null => {
        return regex.test(control.value) ? null : error;
    };
}

export const georgianLettersValidator = customPatternValidator('^[\u10A0-\u10FF]+$', { georgianLetters: true });

export const passwordPatternValidator = customPatternValidator(
    '^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[@$!%*?&,.])[A-Za-z\\d@$!%*?&,.]{8,}$',
    {
        passwordPattern: true,
    },
);

export const personalNumberValidator = customPatternValidator('^[0-9]{11}$', { personalNumber: true });

export const mobileNumberValidator = customPatternValidator('^5\\d{8}$', { mobileNumber: true });
