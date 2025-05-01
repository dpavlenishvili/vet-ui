import { ChangeDetectionStrategy, Component, computed, inject, OnInit, signal } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { TranslocoPipe } from '@jsverse/transloco';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { KENDO_BUTTON } from '@progress/kendo-angular-buttons';
import { KENDO_LOADER } from '@progress/kendo-angular-indicators';
import { catchError, filter, finalize, of, switchMap, tap } from 'rxjs';
import { AuthorizationPageLocalStateService } from '../authorization-page-local-state.service';
import { vetIcons } from '@vet/shared';
import { KENDO_SVGICON } from '@progress/kendo-angular-icons';
import { KENDO_TOOLTIP } from '@progress/kendo-angular-tooltip';
import { toSignal } from '@angular/core/rxjs-interop';
import { RegistrationPhoneVerificationComponent } from '../../registration/registration-phone-verification/registration-phone-verification.component';

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
  protected readonly is2FaPending = signal(true);
  protected readonly isSubmitButtonDisabled = signal(true);
  private readonly state = inject(AuthorizationPageLocalStateService);

  vetIcons = vetIcons;
  activatedRoute = inject(ActivatedRoute);
  query = toSignal(this.activatedRoute.queryParamMap);
  timeSent = computed(() => {
    const timeSent = this.query()?.get('timeSent');

    return timeSent && !isNaN(Number(timeSent)) ? Number(timeSent) : Date.now();
  });

  ngOnInit() {
    this.validateCode();
  }

  getPhoneMask() {
    return this.state.get2FaCredentials()?.phone_mask;
  }

  validateCode() {
    const codeControl = this.confirmationForm.get('code');

    codeControl?.valueChanges
      .pipe(
        filter((code) => code?.length === 4),
        switchMap((code) => {
          if (code) {
            return this.state.validate2FaCode(code).pipe(
              tap(() => {
                this.isSubmitButtonDisabled.set(false);
              }),
              catchError(() => {
                this.isSubmitButtonDisabled.set(true);
                return of(null);
              }),
            );
          } else {
            return of(null);
          }
        }),
      )
      .subscribe();
  }

  protected onSubmit() {
    if (this.confirmationForm.invalid) {
      return;
    }

    this.state.handleSuccessfulAuthentication();
  }
}
