import { ChangeDetectionStrategy, Component, DestroyRef, inject, signal } from '@angular/core';
import { LabelComponent } from '@progress/kendo-angular-label';
import { ErrorComponent, TextBoxModule } from '@progress/kendo-angular-inputs';
import { TranslocoPipe } from '@jsverse/transloco';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ButtonComponent } from '@progress/kendo-angular-buttons';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '@vet/backend';
import { mobileNumberValidator, ToastModule, vetIcons } from '@vet/shared';
import { finalize, tap } from 'rxjs';
import { KENDO_SVGICON } from '@progress/kendo-angular-icons';
import { KENDO_TOOLTIP } from '@progress/kendo-angular-tooltip';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
  selector: 'vet-password-forgot',
  imports: [
    LabelComponent,
    TextBoxModule,
    TranslocoPipe,
    ReactiveFormsModule,
    ButtonComponent,
    RouterLink,
    ToastModule,
    KENDO_SVGICON,
    KENDO_TOOLTIP,
    ErrorComponent,
  ],
  templateUrl: './password-forgot.component.html',
  styleUrl: './password-forgot.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
})
export class PasswordForgotComponent {
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);
  private readonly destroyRef = inject(DestroyRef);

  readonly vetIcons = vetIcons;
  readonly isLoading = signal(false);
  readonly formGroup = signal(this.createFormGroup());

  createFormGroup() {
    return new FormGroup({
      pid: new FormControl('', [Validators.required]),
      phone: new FormControl('', [Validators.required, mobileNumberValidator]),
    });
  }

  onSubmit() {
    const form = this.formGroup();
    if (form.invalid) {
      form.markAllAsTouched();
      return;
    }

    const { pid, phone } = form.value;
    this.isLoading.set(true);

    this.authService
      .initForgetPassword({
        pid: pid?.toString() ?? '',
        phone: phone?.toString() ?? '',
      })
      .pipe(
        tap({
          next: () => {
            this.router.navigate(['password/reset'], {
              queryParams: { pid, phone },
            });
          },
        }),
        finalize(() => this.isLoading.set(false)),
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe();
  }
}
