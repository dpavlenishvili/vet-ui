import { ChangeDetectionStrategy, Component, DestroyRef, inject, OnInit, signal } from '@angular/core';
import { KENDO_BUTTON } from '@progress/kendo-angular-buttons';
import { TranslocoPipe } from '@jsverse/transloco';
import { KENDO_LABEL } from '@progress/kendo-angular-label';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { finalize, tap } from 'rxjs';
import { AuthenticationService, useAuthEnvironment } from '@vet/auth';
import { KENDO_LOADER } from '@progress/kendo-angular-indicators';
import { HttpErrorResponse, HttpStatusCode } from '@angular/common/http';
import { UserLogin2FaResponseBody } from '@vet/backend';
import { AuthorizationPageLocalStateService } from '../authorization-page-local-state.service';
import { KENDO_INPUTS } from '@progress/kendo-angular-inputs';
import { WA_SESSION_STORAGE } from '@ng-web-apis/common';
import { CODE_2FA_SENT } from '../authorization.constants';
import { useAlert } from '@vet/shared';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import * as kendoIcons from '@progress/kendo-svg-icons';

@Component({
  selector: 'vet-authorization-login',
  imports: [TranslocoPipe, ReactiveFormsModule, RouterLink, KENDO_LABEL, KENDO_INPUTS, KENDO_BUTTON, KENDO_LOADER],
  templateUrl: './login-page.component.html',
  styleUrl: './login-page.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LoginPageComponent implements OnInit {
  private readonly storage = inject(WA_SESSION_STORAGE);
  private readonly authenticationService = inject(AuthenticationService);
  private readonly activatedRoute = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly alert = useAlert();
  private readonly authorizationPageLocalStateService = inject(AuthorizationPageLocalStateService);
  private readonly destroyRef = inject(DestroyRef);

  readonly timeoutSeconds = useAuthEnvironment().login2faTimeoutSeconds;
  readonly isLoading = signal(false);
  readonly loginForm = signal(this.createFormGroup());
  readonly showPassword = signal(false);

  // Icons for password visibility toggle
  readonly eyeIcon = kendoIcons.eyeIcon;
  readonly eyeSlashIcon = kendoIcons.eyeSlashIcon;

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
    });
  }

  togglePasswordVisibility(): void {
    this.showPassword.update(current => !current);
  }

  onSubmit() {
    const form = this.loginForm();
    if (form.invalid) {
      form.markAllAsTouched();
      return;
    }

    const { pid, password, remember } = form.value;
    this.submitUserPassword(pid as string, password as string, !!remember);
  }

  private submitUserPassword(pid: string, password: string, remember: boolean) {
    const rawSentCode = this.storage.getItem(CODE_2FA_SENT);

    if (remember) {
      this.authenticationService.setRemember(remember);
    }

    if (rawSentCode) {
      const sentCode = JSON.parse(rawSentCode) as {
        pid: string;
        token: string;
        time: number;
        response: UserLogin2FaResponseBody;
      };

      if (
        sentCode.pid &&
        sentCode.time &&
        sentCode.response &&
        sentCode.pid === pid &&
        Date.now() - sentCode.time < this.timeoutSeconds * 1000
      ) {
        this.authorizationPageLocalStateService.navigateTo2fa(
          sentCode.response,
          {
            pid,
            token: sentCode.token,
          },
          sentCode.time,
        );
        return;
      }
    }

    this.isLoading.set(true);
    this.authenticationService
      .login({ pid, password })
      .pipe(
        tap({
          next: () => this.authorizationPageLocalStateService.handleSuccessfulAuthentication(),
          error: (err: HttpErrorResponse) => {
            if (err.status === HttpStatusCode.Forbidden || err.status === HttpStatusCode.NotAcceptable) {
              const response = err.error as UserLogin2FaResponseBody;
              const time = Date.now();
              this.storage.setItem(
                CODE_2FA_SENT,
                JSON.stringify({
                  pid,
                  token: response.token,
                  time,
                  response,
                }),
              );
              this.authorizationPageLocalStateService.navigateTo2fa(
                response,
                {
                  pid,
                  token: response.token,
                },
                time,
              );
            }
          },
        }),
        finalize(() => this.isLoading.set(false)),
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe();
  }
}
