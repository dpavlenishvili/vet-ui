import { ChangeDetectionStrategy, Component, DestroyRef, effect, inject, input, signal } from '@angular/core';
import { TranslocoPipe } from '@jsverse/transloco';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { distinctUntilChanged, tap } from 'rxjs';
import { HttpErrorResponse } from '@angular/common/http';
import { SmsService } from '@vet/backend';
import { ToastModule, useControlValue, useReactiveControl } from '@vet/shared';
import { ButtonComponent, InputComponent } from '@vet/shared/ui-components';
import { useAuthEnvironment } from '../../auth.providers';
import { RegistrationPhoneVerificationComponent } from '../registration-phone-verification/registration-phone-verification.component';

@Component({
  selector: 'vet-registration-phone',
  imports: [
    ToastModule,
    TranslocoPipe,
    ReactiveFormsModule,
    ButtonComponent,
    InputComponent,
    RegistrationPhoneVerificationComponent,
  ],
  templateUrl: './registration-phone.component.html',
  styleUrl: './registration-phone.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
})
export class RegistrationPhoneComponent {
  form = input<
    FormGroup<{
      phoneNumber: FormControl<string | null>;
      phoneVerificationNumber: FormControl<string | null>;
      isPhoneVerified: FormControl<boolean | null>;
    }>
  >();

  destroyRef = inject(DestroyRef);
  smsService = inject(SmsService);

  status = signal<'initial' | 'verifying' | 'success' | 'invalid'>('initial');
  isPending = signal(false);
  isValid = signal<boolean | null>(null);
  errorMessage = signal<string | null>(null);
  startTime = signal(Date.now());
  isPhoneVerified = useControlValue(this.form, (form) => form.controls.isPhoneVerified);
  phoneVerificationNumberLength = useAuthEnvironment().phoneVerificationNumberLength;

  phoneNumberControl = useReactiveControl(this.form, (form) => form.controls.phoneNumber);

  validatingCode = signal<string>('');

  constructor() {
    effect(() => {
      const form = this.form();

      if (!form) {
        return;
      }

      // Initialize status based on isPhoneVerified
      if (this.isPhoneVerified()) {
        this.status.set('success');
      }

      form
        .get('phoneNumber')
        ?.valueChanges.pipe(
          distinctUntilChanged(),
          tap(() => {
            if (this.status() !== 'initial') {
              this.resetVerificationState();
              // Reset parent control
              form.get('isPhoneVerified')?.setValue(false);
            }
          }),
          takeUntilDestroyed(this.destroyRef),
        )
        .subscribe();

      form
        .get('phoneVerificationNumber')
        ?.valueChanges.pipe(
          distinctUntilChanged(),
          tap(() => {
            const verificationControl = form.get('phoneVerificationNumber');
            const phoneControl = form.get('phoneNumber');
            const currentCode = verificationControl?.value ?? '';
            const isFullCode = currentCode.length === this.phoneVerificationNumberLength;

            if (!verificationControl) {
              return;
            }

            if (this.status() === 'verifying' && phoneControl?.valid && isFullCode && !this.isPending()) {
              this.validatingCode.set(currentCode);
              verificationControl.markAsTouched();
              verificationControl.updateValueAndValidity();
            }
          }),
          takeUntilDestroyed(this.destroyRef),
        )
        .subscribe();

      form
        .get('phoneVerificationNumber')
        ?.statusChanges.pipe(
          distinctUntilChanged(),
          tap(() => {
            const verificationControl = form.get('phoneVerificationNumber');
            const currentCode = verificationControl?.value ?? '';

            if (!verificationControl) {
              return;
            }

            const error = verificationControl?.errors?.['phoneVerificationInvalid'];

            if (
              verificationControl?.hasError('phoneVerificationInvalid') &&
              error &&
              this.validatingCode() === currentCode
            ) {
              const error = verificationControl.getError('phoneVerificationInvalid');
              this.errorMessage.set(typeof error === 'string' ? error : 'auth.phone_verification_invalid');
              this.status.set('invalid');
              verificationControl.setValue('');
              form.get('isPhoneVerified')?.setValue(false);
            } else {
              if (error === false) {
                this.status.set('success');
                verificationControl.setErrors(null);
                form.get('isPhoneVerified')?.setValue(true);
              }

              this.errorMessage.set(null);
            }
          }),
          takeUntilDestroyed(this.destroyRef),
        )
        .subscribe();
    });
  }

  private resetVerificationState() {
    this.isValid.set(null);
    this.errorMessage.set(null);
    this.form()?.get('phoneVerificationNumber')?.reset();
    this.form()?.get('phoneVerificationNumber')?.markAsUntouched();
  }

  onSend() {
    const form = this.form();
    const phoneValue = form?.get('phoneNumber')?.value;

    if (!phoneValue || !form?.get('phoneNumber')?.valid) {
      return;
    }

    this.isPending.set(true);
    this.startTime.set(Date.now());
    this.errorMessage.set(null);

    this.smsService
      .sendSmsCode({
        phone: phoneValue,
      })
      .pipe(
        tap({
          next: () => {
            this.isPending.set(false);
            this.status.set('verifying');
          },
          error: (error: HttpErrorResponse) => {
            this.isPending.set(false);
            const errorCode = error?.error?.error?.code;
            if (errorCode === 1002) {
              this.isPending.set(false);
              this.status.set('verifying');
            } else {
              this.status.set('initial');
              this.errorMessage.set(null);
            }
          },
        }),
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe();
  }

  onCheckClick() {
    const form = this.form();

    if (!form || !this.phoneNumberControl().valid) {
      return;
    }

    const phoneControl = form.get('phoneNumber');
    const verificationControl = form.get('phoneVerificationNumber');

    if (this.status() === 'initial') {
      if (phoneControl?.invalid) {
        phoneControl.markAsTouched();
        return;
      }

      this.onSend();
      return;
    }

    if (this.status() === 'verifying') {
      if (phoneControl?.invalid) {
        phoneControl.markAsTouched();
        return;
      }

      if (!verificationControl?.value || verificationControl.value.length === 0) {
        this.onSend();
        return;
      }

      if (verificationControl?.invalid) {
        verificationControl.markAsTouched();
        this.isValid.set(false);
        return;
      }
    }
  }
}
