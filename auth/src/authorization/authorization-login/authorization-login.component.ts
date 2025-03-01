import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { InputsModule } from '@progress/kendo-angular-inputs';
import { CardModule } from '@progress/kendo-angular-layout';
import { ButtonModule } from '@progress/kendo-angular-buttons';
import { TranslocoPipe } from '@jsverse/transloco';
import { LabelModule } from '@progress/kendo-angular-label';
import { AuthService, UserLogin2FaResponseBody, UserLoginResponseBody } from '@vet/backend';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterLink, Router } from '@angular/router';
import { tap } from 'rxjs';
import { ToastModule, ToastService } from '@vet/shared';
import { personalNumberValidator } from '@vet/shared';
import { CustomAuthService } from '@vet/auth';
import { RegistrationPhoneVerificationComponent } from '../../registration/registration-phone-verification/registration-phone-verification.component';

@Component({
  selector: 'vet-authorization-login',
  standalone: true,
  imports: [
    InputsModule,
    CardModule,
    ButtonModule,
    TranslocoPipe,
    LabelModule,
    ReactiveFormsModule,
    RouterLink,
    ToastModule,
    RegistrationPhoneVerificationComponent,
  ],
  templateUrl: './authorization-login.component.html',
  styleUrl: './authorization-login.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AuthorizationLoginComponent {
  loginForm = this.createFormGroup();
  // phoneForm = this.createPhoneForm();

  isUserLoggedIn = signal(false);
  isLoginFormSubmitted = signal(false);
  isMfaPending = signal(true);
  customAuthService = inject(CustomAuthService);

  constructor(
    private authService: AuthService,
    private toastService: ToastService,
    private router: Router,
  ) {}

  createFormGroup() {
    return new FormGroup({
      pid: new FormControl('', [Validators.required, personalNumberValidator]),
      password: new FormControl('', Validators.required),
      code: new FormControl(''),
      remember: new FormControl(false),
    });
  }

  // createPhoneForm() {
  //   return new FormGroup({
  //     phoneNumber: new FormControl(),
  //     verificationNumber: new FormControl(),
  //   });
  // }

  onSubmit() {
    this.isLoginFormSubmitted.set(true);

    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      return;
    }

    const value = this.loginForm.value;

    if (this.isUserLoggedIn()) {
      this.submitMfa(
        value.pid as string,
        value.password as string,
        value.code as string,
      )
    } else {
      this.submitUserPassword(value.pid as string, value.password as string);
    }
  }

  private submitUserPassword(pid: string, password: string) {
    this.authService
      .loginUser({ pid, password })
      .pipe(
        tap((data: UserLoginResponseBody | UserLogin2FaResponseBody) => {
          if ('phone_mask' in data) {
            this.isUserLoggedIn.set(true);
          } else {
            this.customAuthService.handleSuccessfulAuthorization(data);
            void this.router.navigate(['/']);
          }
        }),
        tap({
          error: (error) => {
            this.toastService.error(error?.error?.error?.message ?? 'auth.failed_to_login');
          },
        }),
      )
      .subscribe();
  }

  private submitMfa(pid: string, password: string, mfaCode: string) {
    this.customAuthService
      .validate2FaCode(pid, password, mfaCode)
      .pipe(
        tap(() => {
          void this.router.navigate(['/']);
        }),
      )
      .subscribe();
  }
}
