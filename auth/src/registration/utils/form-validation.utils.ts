import { FormGroup } from '@angular/forms';

/**
 * Checks if a form only has the 'personNotVerified' error and no other validation errors.
 * Useful for determining if a form should attempt person verification.
 *
 * @param form - The FormGroup to check for errors
 * @returns true if only 'personNotVerified' error exists, false otherwise
 */
export function hasOnlyPersonNotVerifiedError(form: FormGroup | null | undefined): boolean {
  if (!form?.errors) return false;
  const errorKeys = Object.keys(form.errors);
  return errorKeys.length === 1 && form.errors['personNotVerified'];
}

