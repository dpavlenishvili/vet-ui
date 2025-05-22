import { ChangeDetectionStrategy, Component, computed, DestroyRef, inject, signal } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { TranslocoPipe } from '@jsverse/transloco';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { KENDO_BUTTON } from '@progress/kendo-angular-buttons';
import { KENDO_LOADER } from '@progress/kendo-angular-indicators';
import { finalize, tap } from 'rxjs';
import { AuthorizationPageLocalStateService } from '../authorization-page-local-state.service';
import { vetIcons } from '@vet/shared';
import { KENDO_SVGICON } from '@progress/kendo-angular-icons';
import { KENDO_TOOLTIP } from '@progress/kendo-angular-tooltip';
import { takeUntilDestroyed, toSignal } from '@angular/core/rxjs-interop';
import { RegistrationPhoneVerificationComponent, useAuthEnvironment } from '@vet/auth';
import { SmsService } from '@vet/backend';

@Component({
  selector: 'vet-auth-two-factor-page',
  templateUrl: './two-factor-page.component.html',
  imports: [
    ReactiveFormsModule,
    RegistrationPhoneVerificationComponent,
    TranslocoPipe,
    RouterLink,
    KENDO_BUTTON,
    KENDO_LOADER,
    KENDO_SVGICON,
    KENDO_TOOLTIP,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TwoFactorPageComponent {
  private readonly state = inject(AuthorizationPageLocalStateService);
  private readonly activatedRoute = inject(ActivatedRoute);
  private readonly smsService = inject(SmsService);
  private readonly destroyRef = inject(DestroyRef);

  readonly vetIcons = vetIcons;
  readonly is2FaPending = signal(true);
  readonly isLoading = signal(false);
  readonly isValid = signal<boolean | null>(null);
  readonly errorMessage = signal<string | null>(null);

  readonly confirmationForm = signal(this.createFormGroup());
  readonly query = toSignal(this.activatedRoute.queryParamMap);

  readonly timeSent = computed(() => {
    const timeSent = this.query()?.get('timeSent');
    return timeSent && !isNaN(Number(timeSent)) ? Number(timeSent) : Date.now();
  });
  readonly codeControl = computed(() => this.confirmationForm().get('code'));

  createFormGroup() {
    return new FormGroup({
      code: new FormControl<string>('', [
        Validators.required,
        Validators.minLength(useAuthEnvironment().phoneVerificationNumberLength),
      ]),
    });
  }

  getPhoneMask() {
    return this.state.get2FaCredentials()?.phone_mask;
  }

  resendCode() {
    this.isValid.set(null);
    this.errorMessage.set(null);
    this.smsService
      .sendSmsCode({ token: this.state.get2FaCredentials()?.token })
      .pipe(
        tap({
          error: (error) => {
            this.isValid.set(false);
            this.errorMessage.set(error.error.error.message);
          },
        }),
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe();
  }

  onSubmit() {
    const form = this.confirmationForm();
    if (form.invalid) {
      form.markAllAsTouched();
      this.isValid.set(false);
      return;
    }

    const codeControl = this.codeControl();
    this.isLoading.set(true);

    this.state
      .validate2FaCode(codeControl?.value as string)
      .pipe(
        tap({
          next: () => {
            this.state.handleSuccessfulAuthentication();
          },
          error: (error) => {
            this.isValid.set(false);
            this.errorMessage.set(error.error.error.message);
          },
        }),
        finalize(() => this.isLoading.set(false)),
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe();
  }
}
