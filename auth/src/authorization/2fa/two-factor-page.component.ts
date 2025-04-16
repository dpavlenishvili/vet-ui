import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { RegistrationPhoneVerificationComponent } from '../../registration/registration-phone-verification/registration-phone-verification.component';
import { TranslocoPipe } from '@jsverse/transloco';
import { RouterLink } from '@angular/router';
import { KENDO_BUTTON } from '@progress/kendo-angular-buttons';
import { KENDO_LOADER } from '@progress/kendo-angular-indicators';
import { finalize, tap } from 'rxjs';
import { AuthorizationPageLocalStateService } from '../authorization-page-local-state.service';
import { ToastService, vetIcons } from '@vet/shared';
import { KENDO_SVGICON } from '@progress/kendo-angular-icons';
import { KENDO_TOOLTIP } from '@progress/kendo-angular-tooltip';

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
  protected readonly confirmationForm = new FormGroup({
    code: new FormControl<string>('', Validators.required),
  });
  protected readonly is2FaPending = signal(true);
  private readonly state = inject(AuthorizationPageLocalStateService);
  private readonly toastService = inject(ToastService);

  vetIcons = vetIcons;

  getPhoneMask() {
    return this.state.get2FaCredentials()?.phone_mask;
  }

  protected onSubmit() {
    if (this.confirmationForm.invalid) {
      return;
    }
    this.state
      .validate2FaCode(this.confirmationForm.value.code!)
      .pipe(
        tap({
          next: () => this.state.handleSuccessfulAuthentication(),
          error: (error) => {
            this.toastService.error(error?.error?.error?.message ?? 'auth.failed_to_login');
          },
        }),
        finalize(() => this.is2FaPending.set(false)),
      )
      .subscribe();
  }
}
