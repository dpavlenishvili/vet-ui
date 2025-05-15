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
import { RegistrationPhoneVerificationComponent } from '../registration-phone-verification/registration-phone-verification.component';
import { ButtonComponent } from '@progress/kendo-angular-buttons';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { catchError, finalize, of, tap } from 'rxjs';
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

  phase = signal<'initial' | 'verifying' | 'success' | null>(null);
  isPending = signal(false);
  isValid = signal<boolean | null>(null);
  errorMessage = signal<string | null>(null);
  verificationCodeReloader = new Reloader();
  protected readonly RegistrationPhoneVerificationComponent = viewChild(RegistrationPhoneVerificationComponent);

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
          tap(() => this.phase.set('initial')),
          tap(() => form.controls.verificationNumber.setValue('')),
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
    this.isPending.set(true);
    this.verificationCodeReloader
      .reloadable(() => {
        const currentForm = this.form();

        // Check if we should skip SMS code sending
        if (!this.shouldSendVerificationCode(currentForm)) {
          return of();
        }

        // Send the SMS code
        return this.smsService.sendSmsCode({
          phone: currentForm?.value.phoneNumber ?? '',
        }).pipe(
          catchError(error => {
            console.error('Failed to send SMS verification code:', error);
            return of({ status: false });
          })
        );
      })
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe();
  }

  private shouldSendVerificationCode(form?: FormGroup | null): boolean {
    // Check if form exists
    if (!form) {
      return false;
    }

    // Check if we're in a phase where sending code makes sense
    const currentPhase = this.phase();
    const isValidPhase = currentPhase === 'initial' || currentPhase === 'verifying';

    // Check if form controls are valid
    const hasValidPhone = form.controls['phoneNumber']?.valid;

    return isValidPhase && hasValidPhone;
  }

  onSend() {
    console.log('onSent setPending true');
    this.isPending.set(true);
    this.verificationCodeReloader.reload();
  }

  onPreviousClick() {
    this.previousClick.emit();
  }

  onNextClick() {
    const form = this.form();

    if (!form) {
      return;
    }

    // @todo @tsomaia name this function properly and move it somewhere
    const defaultBehavior = () => {
      if (!form.valid) {
        return;
      }

      const { phoneNumber, verificationNumber } = form.value;

      this.smsService
        .validateSms({
          phone: phoneNumber ?? '',
          sms_code: verificationNumber ?? '',
        })
        .pipe(
          tap({
            next: () => {
              this.nextClick.emit();
              this.phase.set('success');
            },
            error: (error) => {
              // this.isPending.set(false);
              this.isValid.set(false);
              this.errorMessage.set(error.error.error.message);
              // this.RegistrationPhoneVerificationComponent()?.reset();
            },
          }),
        )
        .subscribe();
    };

    switch (this.phase()) {
      case 'initial':
        this.phase.set('verifying');
        this.onSend();
        break;

      default:
        defaultBehavior();
        break;
    }
  }
}
