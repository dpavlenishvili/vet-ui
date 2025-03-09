import { FormControl, FormGroup } from '@angular/forms';

export function passwordChangeForm() {
  return new FormGroup({
    password: new FormControl(''),
    password_confirmation: new FormControl(''),
    new_password: new FormControl(''),
  });
}
