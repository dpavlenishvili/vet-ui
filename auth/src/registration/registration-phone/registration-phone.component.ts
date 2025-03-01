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
import { of, tap } from 'rxjs';
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

  phase = signal<'initial' | 'verifying' | 'success'>('initial');
  isPending = signal(false);
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
    });
  }

  ngOnInit() {
     this.isPending.set(true);
    this.verificationCodeReloader
      .reloadable(() => {
        const form = this.form();
        if (!form || !form.controls.phoneNumber.valid) {
          return of();
        }

        return this.smsService.sendSmsCode({
          phone: form.value.phoneNumber ?? '',
        });
      })
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe();
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
            next: () => this.nextClick.emit(),
            error: (error) => {
              this.isPending.set(false);
              this.RegistrationPhoneVerificationComponent()?.reset();
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
