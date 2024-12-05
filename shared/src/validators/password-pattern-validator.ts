import { customPatternValidator } from './custom-pattern-validator';
import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

export const passwordPatternValidator = customPatternValidator(
    '^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[@$!%*?&,.])[A-Za-z\\d@$!%*?&,.]{8,}$',
    {
        passwordPattern: true,
    },
);

export const passwordMatchValidator: ValidatorFn = (
    control: AbstractControl
): ValidationErrors | null => {
    if (!control.value) {
        return null;
    }
    const password = control.get('password')?.value;
    const confirmPassword = control.get('confirmPassword')?.value;
    return password === confirmPassword ? null : { passwordMismatch: true };
};
