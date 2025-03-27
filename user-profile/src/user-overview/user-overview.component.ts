import { ChangeDetectionStrategy, Component, computed, effect, inject, output, signal } from '@angular/core';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import * as kendoIcons from '@progress/kendo-svg-icons';
import { rxResource, takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { map, tap } from 'rxjs/operators';
import { GeneralsService, SmsService, UserReq } from '@vet/backend';
import { getUserOverviewFormData, userOverviewForm } from './user-overview-form';
import { UserProfileSection } from '../user-profile-section';
import { KENDO_SVGICON } from '@progress/kendo-angular-icons';
import { TranslocoPipe } from '@jsverse/transloco';
import { KENDO_LABEL } from '@progress/kendo-angular-label';
import { KENDO_DROPDOWNLIST } from '@progress/kendo-angular-dropdowns';
import { KENDO_INPUTS } from '@progress/kendo-angular-inputs';
import { RegistrationPhoneVerificationComponent } from '@vet/auth';
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
export class UserOverviewComponent extends UserProfileSection {
  kendoIcons = kendoIcons;

  isAddressExpanded = signal(true);
  isContactInfoExpanded = signal(true);
  isSmsCodeSent = signal(false);

  save = output();

  protected readonly form: FormGroup = userOverviewForm();

  generalsService = inject(GeneralsService);
  smsService = inject(SmsService);

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
    });

    this.form
      .get('region')
      ?.valueChanges.pipe(
        tap((region: string) => {
          this.form.get('district')?.reset();
          if (!region) {
            this.form.get('district')?.disable();
            this.filteredDistricts.set([]);
          } else {
            this.form.get('district')?.enable();
            const allDistricts = this.districtsResource.value() || [];
            this.filteredDistricts.set(allDistricts.filter((district: District) => district.region_name === region));
          }
        }),
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe();
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

  handleSave(): void {
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
}
