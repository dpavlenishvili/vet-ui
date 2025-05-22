import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  effect,
  input,
  model,
  type OnInit,
  output,
  signal,
} from '@angular/core';
import { LabelComponent } from '@progress/kendo-angular-label';
import { KENDO_INPUTS, TextBoxComponent } from '@progress/kendo-angular-inputs';
import { TranslocoPipe } from '@jsverse/transloco';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { RegistrationPhoneVerificationComponent } from '@vet/auth';
import { ButtonComponent } from '@progress/kendo-angular-buttons';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { debounceTime, distinctUntilChanged, of, tap } from 'rxjs';
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
  isPhoneVerified = model(false);
  previousClick = output();
  nextClick = output();
  phoneVerificationChange = output<boolean>();

  phase = signal<'initial' | 'verifying' | 'success' | null>(null);
  isPending = signal(false);
  isValid = signal<boolean | null>(null);
  errorMessage = signal<string | null>(null);
  verificationCodeReloader = new Reloader();

  constructor(
    private destroyRef: DestroyRef,
    private smsService: SmsService,
  ) {
    effect(() => {
      const form = this.form();

      if (!form) {
        return;
      }

      form
        .get('phoneNumber')
        ?.valueChanges.pipe(
          debounceTime(300),
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
    const phoneNumber = this.form()?.get('phoneNumber')?.value;
    const verificationNumber = this.form()?.get('verificationNumber')?.value;

    if (phoneNumber && verificationNumber && this.isPhoneVerified()) {
      this.phase.set('success');
    } else if (phoneNumber) {
      this.phase.set('verifying');
      this.isPhoneVerified.set(false);
    } else {
      this.phase.set('initial');
      this.isPhoneVerified.set(false);
    }

    this.isPending.set(true);
    this.verificationCodeReloader
      .reloadable(() => {
        const form = this.form();

        if (!this.shouldSendVerificationCode(form)) {
          return of();
        }

        return this.smsService
          .sendSmsCode({
            phone: form?.get('phoneNumber')?.value ?? '',
          })
          .pipe(
            tap({
              error: (error) => {
                this.isValid.set(false);
                this.errorMessage.set(error.error.error.message);
              },
            }),
          );
      })
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe();
  }

  resetVerification() {
    this.phase.set('initial');
    this.isValid.set(null);
    this.errorMessage.set(null);
    this.isPhoneVerified.set(false);
    this.phoneVerificationChange.emit(false);
    this.form()?.get('verificationNumber')?.reset();
    this.form()?.get('verificationNumber')?.markAsUntouched();
  }

  private shouldSendVerificationCode(form?: FormGroup | null): boolean {
    if (!form) {
      return false;
    }

    const currentPhase = this.phase();
    const isValidPhase = currentPhase === 'initial' || currentPhase === 'verifying';
    const hasValidPhone = form.get('phoneNumber')?.valid as boolean;

    return isValidPhase && hasValidPhone;
  }

  onSend() {
    this.isPending.set(true);
    this.verificationCodeReloader.reload();
  }

  onPreviousClick() {
    if (!this.isPhoneVerified()) {
      this.form()?.get('phoneNumber')?.reset();
      this.resetVerification();
    }
    this.previousClick.emit();
  }

  onNextClick() {
    const form = this.form();

    if (!form) {
      return;
    }

    if (this.isPhoneVerified()) {
      this.nextClick.emit();
      return;
    }

    if (form.get('phoneNumber')?.invalid) {
      form.get('phoneNumber')?.markAsTouched();
      return;
    }

    switch (this.phase()) {
      case 'initial':
        this.phase.set('verifying');
        this.onSend();
        break;

      case 'verifying':
        if (form.get('phoneNumber')?.valid && form.get('verificationNumber')?.invalid) {
          this.isValid.set(false);
        } else if (form.get('phoneNumber')?.valid && form.get('verificationNumber')?.valid) {
          this.validateCode(form.get('phoneNumber')?.value as string, form.get('verificationNumber')?.value as string);
        }
        break;

      default:
        if (form.get('phoneNumber')?.valid && form.get('verificationNumber')?.valid) {
          this.validateCode(form.get('phoneNumber')?.value as string, form.get('verificationNumber')?.value as string);
        }
        break;
    }
  }

  private validateCode(phoneNumber: string, verificationCode: string) {
    this.errorMessage.set(null);
    this.isValid.set(null);
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
            this.errorMessage.set(error.error.error.message);
            this.isValid.set(false);
            this.phase.set('verifying');
          },
        }),
      )
      .subscribe();
  }
}
