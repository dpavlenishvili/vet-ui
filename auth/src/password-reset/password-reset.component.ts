import {
  ChangeDetectionStrategy,
  Component,
  computed,
  DestroyRef,
  inject,
  signal,
  TemplateRef,
  viewChild,
} from '@angular/core';
import { ButtonComponent } from '@progress/kendo-angular-buttons';
import { LabelComponent } from '@progress/kendo-angular-label';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { FormFieldModule, TextBoxComponent } from '@progress/kendo-angular-inputs';
import { TranslocoPipe } from '@jsverse/transloco';
import { passwordMatchValidator, passwordPatternValidator, vetIcons } from '@vet/shared';
import { AuthService } from '@vet/backend';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { finalize, tap } from 'rxjs';
import { DialogRef, DialogService } from '@progress/kendo-angular-dialog';
import { SVGIconComponent } from '@progress/kendo-angular-icons';
import { RegistrationPhoneVerificationComponent, useAuthEnvironment } from '@vet/auth';
import { KENDO_TOOLTIP } from '@progress/kendo-angular-tooltip';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
  selector: 'vet-password-reset',
  standalone: true,
  imports: [
    ButtonComponent,
    LabelComponent,
    ReactiveFormsModule,
    TextBoxComponent,
    TranslocoPipe,
    FormFieldModule,
    SVGIconComponent,
    RouterLink,
    RegistrationPhoneVerificationComponent,
    KENDO_TOOLTIP,
  ],
  templateUrl: './password-reset.component.html',
  styleUrl: './password-reset.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PasswordResetComponent {
  private readonly authService = inject(AuthService);
  private readonly activatedRoute = inject(ActivatedRoute);
  private readonly dialogService = inject(DialogService);
  private readonly router = inject(Router);
  private readonly destroyRef = inject(DestroyRef);

  readonly vetIcons = vetIcons;
  readonly isLoading = signal(false);
  readonly dialogRef = signal<DialogRef | null>(null);
  readonly successDialogContent = viewChild<TemplateRef<unknown>>('successDialogContent');
  readonly formGroup = signal(this.createFormGroup());
  readonly codeControl = computed(() => this.formGroup().get('code'));
  readonly isValid = signal<boolean | null>(null);
  readonly errorMessage = signal<string | null>(null);

  createFormGroup() {
    return new FormGroup(
      {
        code: new FormControl('', [
          Validators.required,
          Validators.minLength(useAuthEnvironment().phoneVerificationNumberLength),
        ]),
        new_password: new FormControl('', [Validators.required, passwordPatternValidator]),
        repeat_password: new FormControl('', [Validators.required, passwordPatternValidator]),
      },
      { validators: passwordMatchValidator },
    );
  }

  getPhoneMask() {
    return this.activatedRoute.snapshot.queryParams['phone'];
  }

  resendCode() {
    const phone = this.activatedRoute.snapshot.queryParams['phone'] ?? '';
    const pid = this.activatedRoute.snapshot.queryParams['pid'] ?? '';
    this.isValid.set(null);
    this.errorMessage.set(null);

    this.authService
      .initForgetPassword({ pid, phone })
      .pipe(
        tap({
          next: () => {
            this.router.navigate(['password/reset'], {
              queryParams: { pid, phone },
            });
          },
          error: (error) => {
            this.isValid.set(false);
            this.errorMessage.set(error.error.error.message);
          },
        }),
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe();
  }

  onSubmit() {
    const form = this.formGroup();
    if (form.invalid) {
      form.markAllAsTouched();
      if (this.codeControl()?.invalid) {
        this.isValid.set(false);
        this.errorMessage.set(null);
      }
      return;
    }

    const { code, new_password } = form.value;
    const activateRouteSnapshot = this.activatedRoute.snapshot;

    this.isLoading.set(true);
    this.isValid.set(null);
    this.errorMessage.set(null);

    this.authService
      .resetPassword({
        pid: activateRouteSnapshot.queryParams['pid'],
        phone: activateRouteSnapshot.queryParams['phone'],
        code: code?.toString() ?? '',
        password: new_password?.toString() ?? '',
      })
      .pipe(
        tap({
          next: () => {
            this.isValid.set(null);
            const dialogRef = this.dialogService.open({
              content: this.successDialogContent(),
              cssClass: 'vet-password-reset-dialog',
            });
            this.dialogRef.set(dialogRef);
          },
          error: (error) => {
            this.isValid.set(false);
            this.errorMessage.set(error.error.error.message);
          },
        }),
        finalize(() => this.isLoading.set(false)),
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe();
  }

  onSuccessDialogClose() {
    const dialogRef = this.dialogRef();
    if (dialogRef) {
      dialogRef.close();
      this.dialogRef.set(null);
    }
  }
}
