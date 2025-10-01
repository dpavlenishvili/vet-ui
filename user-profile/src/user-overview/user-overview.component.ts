import { ChangeDetectionStrategy, Component, computed, effect, inject, output, signal } from '@angular/core';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import * as kendoIcons from '@progress/kendo-svg-icons';
import { rxResource, takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { tap } from 'rxjs/operators';
import { AuthService, GeneralsService, SmsService, UserReq } from '@vet/backend';
import { getOrganisationUserOverviewFormData, getUserOverviewFormData, userOverviewForm } from './user-overview-form';
import { UserProfileSection } from '../user-profile-section';
import { TranslocoPipe } from '@jsverse/transloco';
import { RegistrationPhoneVerificationComponent, RolePipe, UserRolesService } from '@vet/auth';
import { ButtonComponent, IconButtonComponent, InputComponent, SelectorComponent, useControlValue } from '@vet/shared';
import { useDistricts, useFilteredDistricts, useRegions } from '@vet/shared-resources';
import { Router } from '@angular/router';
import { of } from 'rxjs';

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
    RolePipe
  ],
})
export class UserOverviewComponent extends UserProfileSection {
  kendoIcons = kendoIcons;

  isAddressExpanded = signal(true);
  isContactInfoExpanded = signal(true);
  isSmsCodeSent = signal(false);
  protected readonly userRolesService = inject(UserRolesService);
  protected readonly selectedAccountName = computed(() => this.userRolesService.selectedAccountName());
  readonly hasEditRights = computed(() => {
    const isOrganisation = !!this.userRolesService.organisation();
    const isDefaultUser = !isOrganisation;
    const isSuperAdmin = this.userRolesService.hasRole('Super Admin');
  
    return isDefaultUser || isSuperAdmin;
  });

  save = output();

  protected readonly form: FormGroup = userOverviewForm();

  generalsService = inject(GeneralsService);
  smsService = inject(SmsService);
  organisationService = inject(AuthService);

  oldPhoneNumber = '';

  regionsOptions = useRegions();
  districtOptions = useDistricts();

  selectedRegion = useControlValue(this.form, form => form.controls['region']);
  filteredDistricts = useFilteredDistricts(this.selectedRegion, this.districtOptions.value);

  private readonly _organisationUserResource = rxResource({
    request: () => {
      const organisation = this.userRolesService.organisation();
      return {
        code: organisation,
      };
    },
    loader: ({ request: { code } }) => {  
      if(code) {
        return this.organisationService.getUserOrganisation(code)
      }

      return of(null);
    },
  });

  constructor() {
    super();
  
    effect(() => {
      const organisation = this.userRolesService.organisation();
      const organisationUser = this._organisationUserResource.value();
      const user = this.authService.user();
      const canEdit = this.hasEditRights();
    
      const formDataModel = organisation
        ? getOrganisationUserOverviewFormData(organisationUser)
        : getUserOverviewFormData(user);
    
      this.form.reset(formDataModel);
      this.oldPhoneNumber = this.form.value.phone;
    
      if (!canEdit) {
        this.disableFormControls();
      }
    });
  }

  disableFormControls() {
    this.form.get('region')?.disable();
    this.form.get('city')?.disable();
    this.form.get('address')?.disable();
    this.form.get('email')?.disable();
    this.form.get('phone')?.disable();
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
          tap({
            next: () => {
              this.isSmsCodeSent.set(true);
            },
            error: (response) => {
              if (response.error.error.code === 1002) {
                this.isSmsCodeSent.set(true);
              }
            }
          })
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

    if(!this.form.valid) {
      this.form.markAllAsTouched();
      return;
    }

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

  navigateToHomePage() {
    this.router.navigate(['']);
  }
}
