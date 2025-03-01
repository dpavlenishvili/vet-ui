import type { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

export function passwordPatternValidator(control: AbstractControl): { [key: string]: any } | null {
  const patterns = [
    /.*[a-z]{1,}.*/,
    /.*[A-Z]{1,}.*/,
    /.*[0-9]{1,}.*/,
    /.*[!@#$%^&*()-_=+\[\]{}\\|;:'",<.>/?]{1,}.*/,
  ];

  const value = control.value;

  if (!value || (value.length >= 8 && patterns.every(p => p.test(value)))) {
    return null;
  }

  return {
    passwordPattern: true,
  }
}


export const passwordMatchValidator: ValidatorFn = (control: AbstractControl): ValidationErrors | null => {
  if (!control.value) {
    return null;
  }
  const password = control.get('password')?.value;
  const confirmPassword = control.get('confirmPassword')?.value;
  return password === confirmPassword ? null : { passwordMismatch: true };
};
