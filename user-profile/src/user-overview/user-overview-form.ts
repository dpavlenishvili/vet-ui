import { FormControl, FormGroup, Validators } from '@angular/forms';
import { User } from '@vet/backend';

export function userOverviewForm() {
  return new FormGroup({
    name: new FormControl(''),
    region: new FormControl('', Validators.required),
    district: new FormControl('', Validators.required),
    address: new FormControl('', Validators.required),
    email: new FormControl('', Validators.required),
    phone: new FormControl('', Validators.required),
    sms_code: new FormControl(''),
  });
}

export function getUserOverviewFormData(user: User | null) {
  return {
    name: user?.name ?? '',
    region: user?.region ?? '',
    district: user?.city ?? '',
    address: user?.address ?? '',
    email: user?.email ?? '',
    phone: user?.phone ?? '',
    sms_code: '',
  };
}
