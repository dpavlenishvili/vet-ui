import { ChangeDetectionStrategy, Component, computed, effect, inject, OnInit, output, signal } from '@angular/core';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import * as kendoIcons from '@progress/kendo-svg-icons';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { tap } from 'rxjs/operators';
import { GeneralsService, SmsService, UserReq } from '@vet/backend';
import { getUserOverviewFormData, userOverviewForm } from './user-overview-form';
import { UserProfileSection } from '../user-profile-section';
import { TranslocoPipe } from '@jsverse/transloco';
import { RegistrationPhoneVerificationComponent, UserRolesService } from '@vet/auth';
import { ButtonComponent, IconButtonComponent, InputComponent, SelectorComponent, useControlValue } from '@vet/shared';
import { useDistrictsOptions, useRegionsOptions } from '../user-profile.resources';
import { useDistricts, useFilteredDistricts, useRegions } from '@vet/shared-resources';

type UserUpdateReq = {
  address: string,
  region_id: number,
  district_id: number,
  email: string,
}

@Component({
  selector: 'vet-user-overview',
  templateUrl: './user-overview.component.html',
  styleUrl: './user-overview.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    ReactiveFormsModule,
    TranslocoPipe,
    RegistrationPhoneVerificationComponent,
    IconButtonComponent,
    SelectorComponent,
    InputComponent,
    ButtonComponent,
  ],
})
export class UserOverviewComponent extends UserProfileSection implements OnInit {
  kendoIcons = kendoIcons;

  isAddressExpanded = signal(true);
  isContactInfoExpanded = signal(true);
  isSmsCodeSent = signal(false);
  protected readonly userRolesService = inject(UserRolesService);
  protected readonly selectedAccountName = computed(() => this.userRolesService.selectedAccountName());

  save = output();

  protected readonly form: FormGroup = userOverviewForm();

  generalsService = inject(GeneralsService);
  smsService = inject(SmsService);

  oldPhoneNumber = '';

  regionsOptions = useRegions();
  districtOptions = useDistricts();

  selectedRegion = useControlValue(this.form, form => form.controls['region']);
  filteredDistricts = useFilteredDistricts(this.selectedRegion, this.districtOptions.value);

  constructor() {
    super();
    const formDataModel = computed(() => getUserOverviewFormData(this.authService.user()));
    effect(() => {
      this.form.reset(formDataModel());
      this.oldPhoneNumber = this.form.value.phone;
    });
  }

  ngOnInit(): void {
    this.disableControls();
  }

  disableControls() {
    if (!this.userRolesService.hasRole('Default User') && !this.userRolesService.hasRole('Super Admin')) {
      this.form.get('region')?.disable();
      this.form.get('city')?.disable();
      this.form.get('address')?.disable();
      this.form.get('email')?.disable();
      this.form.get('phone')?.disable();
    }
  }

  onAddressExpandClick(): void {
    this.isAddressExpanded.update((expanded) => !expanded);
  }

  onContactInfoExpandClick(): void {
    this.isContactInfoExpanded.update((expanded) => !expanded);
  }

  verifyPhone(): void {
    const targetPhone = { phone: String(this.form.get('phone')?.value) };
    this.isContactInfoExpanded.set(true);

    if (!this.isSmsCodeSent()) {
      this.smsService
        .sendSmsCode(targetPhone)
        .pipe(
          takeUntilDestroyed(this.destroyRef),
          tap(() => {
            this.isSmsCodeSent.set(true);
          }),
        )
        .subscribe();
    }
  }

  resendCode() {
    const phone = this.form.value.phone;
    this.smsService.sendSmsCode(phone).pipe(takeUntilDestroyed(this.destroyRef)).subscribe();
  }

  handleSave(): void {
    const currentPhone = this.form.value.phone;

    if (this.oldPhoneNumber === currentPhone) {
      this.updateUserWithoutPhone();
      return;
    }

    if (!this.isSmsCodeSent()) {
      this.verifyPhone();
      return;
    }

    const validatePhone = {
      phone: String(this.form.get('phone')?.value),
      sms_code: String(this.form.get('sms_code')?.value),
    };

    this.smsService
      .validateSms(validatePhone)
      .pipe(
        takeUntilDestroyed(this.destroyRef),
        tap(() => {
          this.updateUser(this.form.value as UserReq);
          this.isSmsCodeSent.set(false);
        }),
      )
      .subscribe();
  }

  updateUserWithoutPhone() {
    const formValue = this.form.value;
    const userReq: UserUpdateReq = {
      address: formValue.address,
      district_id: formValue.city,
      region_id: formValue.region,
      email: formValue.email,
    };

    this.isSmsCodeSent.set(false);
    this.updateUser(userReq);
  }
}
