import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  effect,
  input,
  type OnInit,
  output,
  signal,
  viewChild,
} from '@angular/core';
import { LabelComponent } from '@progress/kendo-angular-label';
import { KENDO_INPUTS, TextBoxComponent } from '@progress/kendo-angular-inputs';
import { TranslocoPipe } from '@jsverse/transloco';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { RegistrationPhoneVerificationComponent } from '@vet/auth';
import { ButtonComponent } from '@progress/kendo-angular-buttons';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { catchError, debounceTime, distinctUntilChanged, filter, of, tap } from 'rxjs';
import { SmsService } from '@vet/backend';
import { Reloader, ToastModule } from '@vet/shared';

@Component({
  selector: 'vet-registration-phone',
  imports: [
    ToastModule,
    LabelComponent,
    TextBoxComponent,
    TranslocoPipe,
    ReactiveFormsModule,
    RegistrationPhoneVerificationComponent,
    ButtonComponent,
    KENDO_INPUTS,
  ],
  templateUrl: './registration-phone.component.html',
  styleUrl: './registration-phone.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
})
export class RegistrationPhoneComponent implements OnInit {
  form = input<
    FormGroup<{
      phoneNumber: FormControl<string | null>;
      verificationNumber: FormControl<string | null>;
    }>
  >();
  previousClick = output();
  nextClick = output();
  phoneVerificationChange = output<boolean>();

  phase = signal<'initial' | 'verifying' | 'success' | null>(null);
  isPending = signal(false);
  isValid = signal<boolean | null>(null);
  errorMessage = signal<string | null>(null);
  verificationCodeReloader = new Reloader();
  protected readonly verificationComponent = viewChild(RegistrationPhoneVerificationComponent);
  isPhoneVerified = signal(false);

  constructor(
    private destroyRef: DestroyRef,
    private smsService: SmsService,
  ) {
    effect(() => {
      const form = this.form();

      if (!form) {
        return;
      }

      form.valueChanges
        .pipe(
          // რეაგირება მხოლოდ როცა ტელეფონი ვერიფიცირებულია
          filter(() => this.isPhoneVerified()),
          // დაყოვნება 300 მილიწამით
          debounceTime(300),
          // რეაგირება მხოლოდ რეალური ცვლილებისას
          distinctUntilChanged(),
          tap(() => {
            this.resetVerification();
          }),
          takeUntilDestroyed(this.destroyRef),
        )
        .subscribe();
    });
  }

  ngOnInit() {
    const phoneNumber = this.form()?.controls.phoneNumber.value;
    const verificationNumber = this.form()?.controls.verificationNumber.value;

    if (phoneNumber && verificationNumber) {
      this.phase.set('success');
      this.isPhoneVerified.set(true);
      this.phoneVerificationChange.emit(true);
    } else if (phoneNumber) {
      this.phase.set('verifying');
    } else {
      this.phase.set('initial');
    }

    this.isPending.set(true);
    this.verificationCodeReloader
      .reloadable(() => {
        const currentForm = this.form();

        if (!this.shouldSendVerificationCode(currentForm)) {
          return of();
        }

        return this.smsService
          .sendSmsCode({
            phone: currentForm?.value.phoneNumber ?? '',
          })
          .pipe(
            catchError((error) => {
              console.error('Failed to send SMS verification code:', error);
              return of({ status: false });
            }),
          );
      })
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe();
  }

  resetVerification() {
    this.phase.set('initial');
    this.isValid.set(null);
    this.isPhoneVerified.set(false);
    this.phoneVerificationChange.emit(false);
    this.form()?.controls.verificationNumber.setValue('');
  }

  private shouldSendVerificationCode(form?: FormGroup | null): boolean {
    if (!form) {
      return false;
    }

    const currentPhase = this.phase();
    const isValidPhase = currentPhase === 'initial' || currentPhase === 'verifying';
    const hasValidPhone = form.controls['phoneNumber']?.valid;

    return isValidPhase && hasValidPhone;
  }

  onSend() {
    this.isPending.set(true);
    this.verificationCodeReloader.reload();
  }

  onPreviousClick() {
    const phoneNumber = this.form()?.controls.phoneNumber.value;
    const verificationNumber = this.form()?.controls.verificationNumber.value;
    if (phoneNumber && !verificationNumber) {
      this.form()?.controls.phoneNumber.reset();
    }
    this.previousClick.emit();
  }

  onNextClick() {
    const form = this.form();

    if (!form) {
      return;
    }

    // თუ უკვე ვერიფიცირებულია, გადადი შემდეგ ეტაპზე
    if (this.isPhoneVerified()) {
      this.nextClick.emit();
      return;
    }

    // შეამოწმე ნომრის ვალიდურობა გაგრძელებამდე
    if (!form.controls.phoneNumber.valid) {
      form.controls.phoneNumber.markAsTouched();
      return;
    }

    // Different behavior based on current phase
    switch (this.phase()) {
      case 'initial':
        // If in initial phase, move to verifying and send code
        this.phase.set('verifying');
        this.onSend();
        break;

      case 'verifying':
        // If in verifying phase, validate the code if provided
        if (form.value.phoneNumber && !form.value.verificationNumber) {
          this.isValid.set(false);
        } else if (form.value.phoneNumber && form.value.verificationNumber) {
          this.validateCode(form.value.phoneNumber as string, form.value.verificationNumber as string);
        }
        break;

      default:
        // In any other case, try to validate if we have both phone and code
        if (form.value.phoneNumber && form.value.verificationNumber) {
          this.validateCode(form.value.phoneNumber as string, form.value.verificationNumber as string);
        }
        break;
    }
  }

  // Validate the SMS code
  private validateCode(phoneNumber: string, verificationCode: string) {
    this.smsService
      .validateSms({
        phone: phoneNumber,
        sms_code: verificationCode,
      })
      .pipe(
        tap({
          next: () => {
            this.isPhoneVerified.set(true);
            this.phoneVerificationChange.emit(true);
            this.nextClick.emit();
            this.phase.set('success');
          },
          error: (error) => {
            this.isValid.set(false);
            this.errorMessage.set(error.error.error.message);
            this.phase.set('verifying');
          },
        }),
      )
      .subscribe();
  }
}
