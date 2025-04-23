import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { KENDO_BUTTON } from '@progress/kendo-angular-buttons';
import { TranslocoPipe } from '@jsverse/transloco';
import { KENDO_LABEL } from '@progress/kendo-angular-label';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { finalize, tap } from 'rxjs';
import { AuthenticationService } from '../../authentication.service';
import { KENDO_LOADER } from '@progress/kendo-angular-indicators';
import { HttpErrorResponse, HttpStatusCode } from '@angular/common/http';
import { UserLogin2FaResponseBody } from '@vet/backend';
import { AuthorizationPageLocalStateService } from '../authorization-page-local-state.service';
import { KENDO_INPUTS } from '@progress/kendo-angular-inputs';
import { WA_SESSION_STORAGE } from '@ng-web-apis/common';
import { CODE_2FA_SENT } from '../authorization.constants';
import { useAuthEnvironment } from '@vet/auth';

@Component({
  selector: 'vet-authorization-login',
  imports: [TranslocoPipe, ReactiveFormsModule, RouterLink, KENDO_LABEL, KENDO_INPUTS, KENDO_BUTTON, KENDO_LOADER],
  templateUrl: './login-page.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LoginPageComponent {
  private readonly storage = inject(WA_SESSION_STORAGE);

  protected readonly loginForm = new FormGroup({
    pid: new FormControl('', [Validators.required]),
    password: new FormControl('', Validators.required),
    remember: new FormControl(false),
  });

  protected readonly isLoginFormSubmitted = signal(false);
  protected readonly isLoginLoading = signal(false);
  private readonly authenticationService = inject(AuthenticationService);
  private readonly authorizationPageLocalStateService = inject(AuthorizationPageLocalStateService);
  timeoutSeconds = useAuthEnvironment().login2faTimeoutSeconds;

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
    const rawSentCode = this.storage.getItem(CODE_2FA_SENT);

    if (rawSentCode) {
      const sentCode = JSON.parse(rawSentCode) as {
        pid: string;
        time: number;
        response: UserLogin2FaResponseBody;
      };

      if (sentCode.pid
        && sentCode.time
        && sentCode.response
        && sentCode.pid === pid
        && (Date.now() - sentCode.time) < (this.timeoutSeconds * 1000)
      ) {
        this.authorizationPageLocalStateService.navigateTo2fa(sentCode.response, { pid, password }, sentCode.time);
        return;
      }
    }

    this.isLoginLoading.set(true);
    this.authenticationService
      .login({ pid, password })
      .pipe(
        tap({
          next: () => this.authorizationPageLocalStateService.handleSuccessfulAuthentication(),
          error: (err: HttpErrorResponse) => {
            if (err.status === HttpStatusCode.Forbidden || err.status === HttpStatusCode.NotAcceptable) {
              const response = err.error as UserLogin2FaResponseBody;
              this.storage.setItem(CODE_2FA_SENT, JSON.stringify({
                pid,
                time: Date.now(),
                response,
              }))
              this.authorizationPageLocalStateService.navigateTo2fa(response, { pid, password });
            }
          },
        }),
        finalize(() => this.isLoginLoading.set(false)),
      )
      .subscribe();
  }
}
