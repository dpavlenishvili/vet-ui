import { RegistrationPhoneVerificationComponent } from '@vet/auth';
import { LabelModule } from '@progress/kendo-angular-label';
import { InputsModule } from '@progress/kendo-angular-inputs';
import { ButtonModule } from '@progress/kendo-angular-buttons';
import { CardModule } from '@progress/kendo-angular-layout';
import { ChangeDetectionStrategy, Component, computed, effect, inject, output, signal } from '@angular/core';
import * as kendoIcons from '@progress/kendo-svg-icons';
import { SVGIconModule } from '@progress/kendo-angular-icons';
import { TranslocoPipe } from '@jsverse/transloco';
import { ReactiveFormsModule } from '@angular/forms';
import { GeneralsService, SmsService, UserReq } from '@vet/backend';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { map, tap } from 'rxjs';
import { AsyncPipe } from '@angular/common';
import { DropDownListModule } from '@progress/kendo-angular-dropdowns';
import { getUserOverviewFormData, userOverviewForm } from './user-overview-form';
import { UserProfileSection } from '../user-profile-section';

@Component({
  selector: 'vet-user-overview',
  imports: [
    CardModule,
    ButtonModule,
    InputsModule,
    LabelModule,
    SVGIconModule,
    TranslocoPipe,
    ReactiveFormsModule,
    RegistrationPhoneVerificationComponent,
    AsyncPipe,
    DropDownListModule,
  ],
  templateUrl: './user-overview.component.html',
  styleUrl: './user-overview.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UserOverviewComponent extends UserProfileSection {
  kendoIcons = kendoIcons;
  isAddressExpanded = false;
  isContactInfoExpanded = false;
  isSmsCodeSent = signal(false);

  save = output();

  protected readonly form = userOverviewForm();

  generalsService = inject(GeneralsService);
  smsService = inject(SmsService);

  districts$ = this.generalsService.getDistrictsList().pipe(map((response) => response.data));
  regions$ = this.generalsService.getRegionsList().pipe(map((response) => response.data));

  constructor() {
    super();
    const formDataModel = computed(() => getUserOverviewFormData(this.authService.user()));
    effect(() => {
      this.form.reset(formDataModel());
    });
  }

  onAddressExpandClick() {
    this.isAddressExpanded = !this.isAddressExpanded;
  }

  onContactInfoExpandClick() {
    this.isContactInfoExpanded = !this.isContactInfoExpanded;
  }

  verifyPhone() {
    const targetPhone = {
      phone: String(this.form?.value.phone),
    };

    this.isContactInfoExpanded = true;

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

  handleSave() {
    const validatePhone = {
      phone: String(this.form?.value.phone),
      sms_code: String(this.form?.value.sms_code),
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
