import type { AbstractControl, ValidatorFn } from '@angular/forms';

export function customPatternValidator(
  pattern: string | RegExp,
  error: { [key: string]: string | boolean },
): ValidatorFn {
  const regex = new RegExp(pattern);
  return (control: AbstractControl): { [key: string]: any } | null => {
    if (!control.value) {
      return null;
    }
    return regex.test(control.value) ? null : error;
  };
}
