import type { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

export function passwordPatternValidator(control: AbstractControl): ValidationErrors | null {
  const patterns = [
    /.*[a-z]+.*/,
    /.*[A-Z]+.*/,
    /.*[0-9]+.*/,
    // eslint-disable-next-line no-useless-escape
    /.*[!@#$%^&*()-_=+\[\]{}\\|;:'",<.>/?]+.*/,
  ];

  const value = control.value;

  if (!value || (value.length >= 8 && patterns.every(p => p.test(value)))) {
    return null;
  }

  return {
    passwordPattern: true,
  };
}

export const passwordMatchValidator: ValidatorFn = (control: AbstractControl): ValidationErrors | null => {
  const passwordControl = control.get('password') || control.get('new_password');
  const confirmPasswordControl = control.get('confirmPassword') || control.get('repeat_password');

  if (!passwordControl || !confirmPasswordControl) {
    return null;
  }

  const password = passwordControl.value;
  const confirmPassword = confirmPasswordControl.value;

  if (!password || !confirmPassword) {
    return null;
  }

  const passwordHasPatternError = passwordControl.hasError('passwordPattern');
  const confirmPasswordHasPatternError = confirmPasswordControl.hasError('passwordPattern');

  if (passwordHasPatternError || confirmPasswordHasPatternError) {
    return null;
  }

  return password === confirmPassword ? null : { passwordMismatch: true };
};
