import { FormControl, FormGroup, Validators } from '@angular/forms';
import { OrganisationRes, User } from '@vet/backend';

export function userOverviewForm(): FormGroup {
  return new FormGroup({
    name: new FormControl(''),
    region: new FormControl(null, Validators.required),
    city: new FormControl(null, Validators.required),
    address: new FormControl(null, Validators.required),
    email: new FormControl(null),
    phone: new FormControl(null, Validators.required),
    sms_code: new FormControl(''),
  });
}

export function getUserOverviewFormData(user: User | null) {
  return {
    name: user?.name ?? '',
    region: user?.region?.id ?? '',
    city: user?.district?.id ?? '',
    address: user?.address ?? '',
    email: user?.email ?? '',
    phone: user?.phone ?? '',
    sms_code: '',
  };
}

export function getOrganisationUserOverviewFormData(user: OrganisationRes | null | undefined) {
  return {
    name: user?.name ?? '',
    region: user?.region_id ?? '',
    city: user?.district_id ?? '',
    address: user?.address ?? '',
    email: user?.email ?? '',
    phone: user?.phone ?? '',
    sms_code: '',
  };
}
