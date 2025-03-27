import { customPatternValidator } from './custom-pattern-validator';
import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

export const mobileNumberValidator = customPatternValidator('^5\\d{8}$', {
  mobileNumber: true,
});


export const georgianMobileValidator: ValidatorFn = (control: AbstractControl): ValidationErrors | null => {
  const value = control.value || '';
  if (!value) return null; // optional field

  const georgianPattern = /^5\d{8}$/;
  return georgianPattern.test(value) ? null : { mobileNumber: true };
};
