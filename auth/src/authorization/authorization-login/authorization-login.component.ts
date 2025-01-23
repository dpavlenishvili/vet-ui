import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { InputsModule } from '@progress/kendo-angular-inputs';
import { CardModule } from '@progress/kendo-angular-layout';
import { ButtonModule } from '@progress/kendo-angular-buttons';
import { TranslocoPipe } from '@jsverse/transloco';
import { LabelModule } from '@progress/kendo-angular-label';
import { AuthService } from '@vet/backend';
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
  phoneForm = this.createPhoneForm();

  isUserLoggedIn = signal(false);
  customAuthService = inject(CustomAuthService);

  constructor(
    private authService: AuthService,
    private toastService: ToastService,
    private router: Router,
  ) {}

  createFormGroup() {
    return new FormGroup({
      pid: new FormControl(null, [Validators.required, personalNumberValidator]),
      password: new FormControl(null, Validators.required),
      code: new FormControl(''),
    });
  }

  createPhoneForm() {
    return new FormGroup({
      phoneNumber: new FormControl(),
      verificationNumber: new FormControl(),
    });
  }

  onNextStep() {
    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      return;
    }

    const value = this.loginForm.value;

    this.authService
      .loginUser({ pid: String(value.pid), password: String(value.password) })
      .pipe(
        tap({
          next: () => {
            this.isUserLoggedIn.set(true);
          },
          error: (error) => {
            this.toastService.error(error?.error?.error?.message ?? 'auth.failed_to_login');
          },
        }),
      )
      .subscribe();
  }

  onSubmit() {
    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      return;
    }

    const value = this.loginForm.value;

    this.customAuthService
      .validate2FaCode(String(value.pid), String(value.password), String(value.code))
      .pipe(
        tap(() => {
          this.router.navigate(['/home']);
        }),
      )
      .subscribe();
  }
}
