import { ChangeDetectionStrategy, Component, computed, inject, OnInit, signal } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { RegistrationPhoneVerificationComponent } from '../../registration/registration-phone-verification/registration-phone-verification.component';
import { TranslocoPipe } from '@jsverse/transloco';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { KENDO_BUTTON } from '@progress/kendo-angular-buttons';
import { KENDO_LOADER } from '@progress/kendo-angular-indicators';
import { finalize, tap } from 'rxjs';
import { AuthorizationPageLocalStateService } from '../authorization-page-local-state.service';
import { ToastService, vetIcons } from '@vet/shared';
import { KENDO_SVGICON } from '@progress/kendo-angular-icons';
import { KENDO_TOOLTIP } from '@progress/kendo-angular-tooltip';
import { toSignal } from '@angular/core/rxjs-interop';

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
export class TwoFactorPageComponent implements OnInit {
  protected readonly confirmationForm = new FormGroup({
    code: new FormControl<string>('', Validators.required),
  });
  protected readonly is2FaPending = signal(false);
  private readonly state = inject(AuthorizationPageLocalStateService);
  private readonly toastService = inject(ToastService);

  vetIcons = vetIcons;
  activatedRoute = inject(ActivatedRoute);
  query = toSignal(this.activatedRoute.queryParamMap);
  timeSent = computed(() => {
    const timeSent = this.query()?.get('timeSent');

    return timeSent && !isNaN(Number(timeSent)) ? Number(timeSent) : Date.now();
  });

  ngOnInit() {
    this.is2FaPending.set(true);
  }

  getPhoneMask() {
    return this.state.get2FaCredentials()?.phone_mask;
  }

  protected onSubmit() {
    if (this.confirmationForm.invalid) {
      return;
    }
    this.is2FaPending.set(true);
    this.state
      .validate2FaCode(this.confirmationForm.value.code!)
      .pipe(
        tap({
          next: () => this.state.handleSuccessfulAuthentication(),
          error: (error) => {
            this.is2FaPending.set(false);
            this.toastService.error(error?.error?.error?.message ?? 'auth.failed_to_login');
          },
        }),
        finalize(() => this.is2FaPending.set(false)),
      )
      .subscribe();
  }
}
