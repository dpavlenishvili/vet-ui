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
import { catchError, of, tap } from 'rxjs';
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
  protected readonly RegistrationPhoneVerificationComponent = viewChild(RegistrationPhoneVerificationComponent);

  private lastVerifiedPhoneNumber = '';
  private isPhoneVerified = false;

  constructor(
    private destroyRef: DestroyRef,
    private smsService: SmsService,
  ) {
    effect(() => {
      const form = this.form();

      if (!form) {
        return;
      }

      form.controls.phoneNumber.valueChanges
        .pipe(
          tap((newPhoneNumber) => {
            if (this.isPhoneVerified && this.lastVerifiedPhoneNumber !== newPhoneNumber) {
              this.phase.set('initial');
              this.isValid.set(null);
              this.isPhoneVerified = false;
              this.phoneVerificationChange.emit(false);
              form.controls.verificationNumber.setValue('');
            }
          }),
          takeUntilDestroyed(this.destroyRef),
        )
        .subscribe();

      form.controls.verificationNumber.valueChanges
        .pipe(
          tap(() => {
            this.isValid.set(null);
            this.errorMessage.set(null);
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
      this.isPhoneVerified = true;
      this.lastVerifiedPhoneNumber = phoneNumber;
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

  private shouldSendVerificationCode(form?: FormGroup | null): boolean {
    if (!form) {
      return false;
    }

    if (this.isPhoneVerified && form.controls['phoneNumber'].value === this.lastVerifiedPhoneNumber) {
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

    if (this.isPhoneVerified && this.lastVerifiedPhoneNumber === form.controls.phoneNumber.value) {
      this.nextClick.emit();
      return;
    }

    // @todo @tsomaia name this function properly and move it somewhere
    const defaultBehavior = () => {
      if (!form.valid) {
        return;
      }

      const { phoneNumber, verificationNumber } = form.value;

      if (phoneNumber && verificationNumber) {
        this.smsService
          .validateSms({
            phone: phoneNumber ?? '',
            sms_code: verificationNumber ?? '',
          })
          .pipe(
            tap({
              next: () => {
                this.isPhoneVerified = true;
                this.phoneVerificationChange.emit(true);
                this.nextClick.emit();
                this.phase.set('success');
                this.lastVerifiedPhoneNumber = phoneNumber ?? '';
              },
              error: (error) => {
                this.isValid.set(false);
                this.errorMessage.set(error.error.error.message);
              },
            }),
          )
          .subscribe();
      }
    };

    switch (this.phase()) {
      case 'initial':
        this.phase.set('verifying');
        this.onSend();
        break;

      case 'verifying':
        if (form.value.phoneNumber && !form.value.verificationNumber) {
          this.isValid.set(false);
        } else if (form.value.phoneNumber && form.value.verificationNumber) {
          defaultBehavior();
        }
        break;

      default:
        defaultBehavior();
        break;
    }
  }
}
