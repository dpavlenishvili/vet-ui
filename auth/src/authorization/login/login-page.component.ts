import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { KENDO_BUTTON } from '@progress/kendo-angular-buttons';
import { TranslocoPipe } from '@jsverse/transloco';
import { KENDO_LABEL } from '@progress/kendo-angular-label';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { finalize, tap } from 'rxjs';
import { personalNumberValidator, ToastService } from '@vet/shared';
import { AuthenticationService } from '../../authentication.service';
import { KENDO_LOADER } from '@progress/kendo-angular-indicators';
import { HttpErrorResponse, HttpStatusCode } from '@angular/common/http';
import { UserLogin2FaResponseBody } from '@vet/backend';
import { AuthorizationPageLocalStateService } from '../authorization-page-local-state.service';
import { KENDO_INPUTS } from '@progress/kendo-angular-inputs';

@Component({
  selector: 'vet-authorization-login',
  imports: [TranslocoPipe, ReactiveFormsModule, RouterLink, KENDO_LABEL, KENDO_INPUTS, KENDO_BUTTON, KENDO_LOADER],
  templateUrl: './login-page.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LoginPageComponent {
  protected readonly loginForm = new FormGroup({
    pid: new FormControl('', [Validators.required, personalNumberValidator]),
    password: new FormControl('', Validators.required),
    remember: new FormControl(false),
  });

  protected readonly isLoginFormSubmitted = signal(false);
  protected readonly isLoginLoading = signal(false);
  private readonly authenticationService = inject(AuthenticationService);
  private readonly authorizationPageLocalStateService = inject(AuthorizationPageLocalStateService);
  private readonly toastService = inject(ToastService);

  protected onSubmit() {
    this.isLoginFormSubmitted.set(true);

    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      return;
    }

    const value = this.loginForm.value;

    this.submitUserPassword(value.pid as string, value.password as string);
  }

  private submitUserPassword(pid: string, password: string) {
    this.isLoginLoading.set(true);
    this.authenticationService
      .login({ pid, password })
      .pipe(
        tap({
          next: () => this.authorizationPageLocalStateService.handleSuccessfulAuthentication(),
          error: (err: HttpErrorResponse) => {
            if (err.status === HttpStatusCode.Forbidden) {
              const response = err.error as UserLogin2FaResponseBody;
              this.authorizationPageLocalStateService.navigateTo2fa(response, { pid, password });
            }
            if (err.status === HttpStatusCode.Unauthorized) {
              this.toastService.error(err?.error?.error?.message ?? 'auth.failed_to_login');
            }
          },
        }),
        finalize(() => this.isLoginLoading.set(false)),
      )
      .subscribe();
  }
}
