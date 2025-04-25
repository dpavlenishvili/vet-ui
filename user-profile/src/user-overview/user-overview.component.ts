import { ChangeDetectionStrategy, Component, OnInit, computed, effect, inject, output, signal } from '@angular/core';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import * as kendoIcons from '@progress/kendo-svg-icons';
import { rxResource, takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { map, tap } from 'rxjs/operators';
import { GeneralsService, SmsService, UserReq, UserUpdateReq } from '@vet/backend';
import { getUserOverviewFormData, userOverviewForm } from './user-overview-form';
import { UserProfileSection } from '../user-profile-section';
import { KENDO_SVGICON } from '@progress/kendo-angular-icons';
import { TranslocoPipe } from '@jsverse/transloco';
import { KENDO_LABEL } from '@progress/kendo-angular-label';
import { KENDO_DROPDOWNLIST } from '@progress/kendo-angular-dropdowns';
import { KENDO_INPUTS } from '@progress/kendo-angular-inputs';
import { RegistrationPhoneVerificationComponent, UserRolesService } from '@vet/auth';
import { KENDO_BUTTON } from '@progress/kendo-angular-buttons';
import { District } from '@vet/shared';

@Component({
  selector: 'vet-user-overview',
  templateUrl: './user-overview.component.html',
  styleUrl: './user-overview.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    ReactiveFormsModule,
    KENDO_SVGICON,
    TranslocoPipe,
    KENDO_LABEL,
    KENDO_DROPDOWNLIST,
    KENDO_INPUTS,
    RegistrationPhoneVerificationComponent,
    KENDO_BUTTON,
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

  regionsResource = rxResource({
    loader: () => this.generalsService.getRegionsList().pipe(map((response) => response.data)),
  });

  districtsResource = rxResource({
    loader: () => this.generalsService.getDistrictsList().pipe(map((response) => response.data)),
  });

  filteredDistricts = signal<District[]>([]);

  constructor() {
    super();
    const formDataModel = computed(() => getUserOverviewFormData(this.authService.user()));
    effect(() => {
      this.form.reset(formDataModel());
      const region = this.form.get('region')?.value;
      this.setFilteredDistricts(region);
      this.oldPhoneNumber = this.form.value.phone;
    });

    this.form
      .get('region')
      ?.valueChanges.pipe(
        tap((region: string) => {
          this.form.get('district')?.reset();
          if (!region) {
            this.filteredDistricts.set([]);
          } else {
            this.setFilteredDistricts(region);
          }
        }),
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe();
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

  setFilteredDistricts(region: string) {
    const allDistricts = this.districtsResource.value() || [];
    this.filteredDistricts.set(allDistricts.filter((district: District) => district.region_name === region));
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
      city: formValue.city,
      region: formValue.region,
      email: formValue.email,
    };

    this.isSmsCodeSent.set(false);
    this.updateUser(userReq);
  }
}
