import { RegistrationPhoneVerificationComponent } from './../../../auth/src/registration/registration-phone-verification/registration-phone-verification.component';
import { LabelModule } from '@progress/kendo-angular-label';
import { InputsModule } from '@progress/kendo-angular-inputs';
import { ButtonModule } from '@progress/kendo-angular-buttons';
import { CardModule } from '@progress/kendo-angular-layout';
import { ChangeDetectionStrategy, Component, input, output, DestroyRef, signal } from '@angular/core';
import * as kendoIcons from '@progress/kendo-svg-icons';
import { SVGIconModule } from '@progress/kendo-angular-icons';
import { TranslocoPipe } from '@jsverse/transloco';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { FormatDatePipe } from '@vet/shared';
import { SmsService } from '@vet/backend';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { tap } from 'rxjs';

@Component({
  selector: 'vet-user-overview',
  standalone: true,
  imports: [
    CardModule,
    ButtonModule,
    InputsModule,
    LabelModule,
    SVGIconModule,
    TranslocoPipe,
    ReactiveFormsModule,
    RegistrationPhoneVerificationComponent,
  ],
  providers: [FormatDatePipe],
  templateUrl: './user-overview.component.html',
  styleUrl: './user-overview.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UserOverviewComponent {
  kendoIcons = kendoIcons;
  isAddressExpanded = false;
  isContactInfoExpanded = false;
  isSmsCodeSent = signal(false);

  save = output();

  form = input<
    FormGroup<{
      name: FormControl<string | null>;
      region: FormControl<string | null>;
      district: FormControl<string | null>;
      address: FormControl<string | null>;
      email: FormControl<string | null>;
      phone: FormControl<string | null>;
      sms_code: FormControl<string | null>;
    }>
  >();

  constructor(
    private smsService: SmsService,
    private destroyRef: DestroyRef,
  ) {}

  onAdressExpandClick() {
    this.isAddressExpanded = !this.isAddressExpanded;
  }

  onContactInfoExpandClick() {
    this.isContactInfoExpanded = !this.isContactInfoExpanded;
  }

  verifyPhone() {
    const targetPhone = {
      phone: String(this.form()?.value.phone),
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
      phone: String(this.form()?.value.phone),
      sms_code: String(this.form()?.value.sms_code),
    };
    this.smsService
      .validateSms(validatePhone)
      .pipe(
        takeUntilDestroyed(this.destroyRef),
        tap(() => {
          this.save.emit();
          this.isSmsCodeSent.set(false);
        }),
      )
      .subscribe();
  }
}
