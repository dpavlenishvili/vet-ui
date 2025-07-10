import { ChangeDetectionStrategy, Component, inject, OnInit, signal } from '@angular/core';
import { TranslocoPipe } from '@jsverse/transloco';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { RegistrationPhoneVerificationComponent, useAuthEnvironment } from '@vet/auth';
import { KENDO_LOADER } from '@progress/kendo-angular-indicators';
import {
  ButtonComponent,
  conditionalValidator,
  IconButtonComponent,
  InfoComponent,
  InputComponent,
  useAlert,
  useToast,
  useToggleState,
  VetCheckboxComponent,
  withSignalValidation,
} from '@vet/shared';
import { useAuthorizationSession } from '../signals/useAuthorizationSession';
import { AuthorizationError } from '../../auth.types';

@Component({
  selector: 'vet-authorization-login',
  imports: [
    TranslocoPipe,
    ReactiveFormsModule,
    RouterLink,
    KENDO_LOADER,
    InputComponent,
    IconButtonComponent,
    VetCheckboxComponent,
    ButtonComponent,
    RegistrationPhoneVerificationComponent,
    InfoComponent,
  ],
  templateUrl: './login-page.component.html',
  styleUrl: './login-page.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LoginPageComponent implements OnInit {
  private readonly activatedRoute = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly alert = useAlert();
  private readonly toast = useToast();
  readonly authEnvironment = useAuthEnvironment();
  readonly isPasswordVisible = useToggleState(false);
  readonly twoFaError = signal<string | null>(null);

  readonly auth = useAuthorizationSession({
    onLogin: () => void this.router.navigate(['/']),
    onError: (error) => this.onError(error),
    onReset: () => this.onReset(),
  });

  readonly formGroup = this.createFormGroup();

  ngOnInit() {
    if (this.activatedRoute.snapshot.queryParamMap.get('referrer') === 'registration') {
      this.alert.show({
        text: 'auth.alert_registration_successful',
        onClose: () => {
          const { referrer: _, ...params } = this.activatedRoute.snapshot.queryParams;
          void this.router.navigate([], {
            queryParams: params,
          });
        },
      });
    }
  }

  createFormGroup() {
    return new FormGroup({
      pid: new FormControl('', Validators.required),
      password: new FormControl('', Validators.required),
      remember: new FormControl(false),
      code: withSignalValidation(
        new FormControl<string | null>(
          null,
          conditionalValidator({
            when: () => this.auth.is2FaSessionActive(),
            then: () =>
              Validators.compose([
                Validators.required,
                Validators.minLength(this.authEnvironment.phoneVerificationNumberLength),
              ]),
          }),
        ),
        [this.auth.is2FaSessionActive],
      ),
    });
  }

  onSubmit() {
    const form = this.formGroup;
    const { pid, password, remember, code } = this.formGroup.value;

    if (form.invalid) {
      form.markAllAsTouched();
      return;
    }

    if (!this.auth.is2FaSessionActive()) {
      void this.auth.submitCredentials({
        pid: pid as string,
        password: password as string,
        remember: remember as boolean,
      });
    } else {
      void this.auth.validate2FaCode(code as string);
    }
  }

  goBackToLogin() {
    this.auth.resetAuthorizationSession();
    this.formGroup.patchValue({
      code: '',
    });
  }

  private onError(error: AuthorizationError) {
    console.log('error', error);

    switch (error.code) {
      case 'INVALID_CREDENTIALS':
        this.toast.error('auth.invalid_credentials');
        break;

      case 'TEMPORARILY_LOCKED':
        this.onAuthorizationTemporarilyLocked((error.attributes?.['lockedForSeconds'] as number) ?? null);
        break;

      case '2FA_RESEND_FAILED':
        this.twoFaError.set('auth.resend_failed');
        break;

      case '2FA_SESSION_EXPIRED':
        this.twoFaError.set('auth.2fa_session_expired');
        break;

      case 'INVALID_2FA_SESSION':
        this.twoFaError.set('auth.2fa_used');
        break;

      case 'INVALID_2FA_CODE':
        this.twoFaError.set('auth.invalid_2fa_code');
        this.formGroup.controls.code.patchValue('');
        break;

      case '2FA_CODE_EXPIRED':
        this.twoFaError.set('auth.2fa_code_expired');
        this.formGroup.controls.code.patchValue('');
        break;

      case '2FA_VALIDATION_FAILED':
        this.twoFaError.set('auth.2fa_validation_failed');
        break;

      default:
        this.toast.error('auth.auth_error');
        break;
    }
  }

  private onReset() {
    this.twoFaError.set(null);
  }

  private onAuthorizationTemporarilyLocked(lockedForSeconds: number | null) {
    if (lockedForSeconds) {
      this.toast.error('auth.please_wait_n_seconds_before_login', {
        translateParams: { seconds: lockedForSeconds },
      });
    } else {
      this.toast.error('auth.please_wait_before_login');
    }
  }
}
