import { ChangeDetectionStrategy, Component, DestroyRef, TemplateRef, inject, viewChild } from '@angular/core';
import { ButtonComponent } from '@progress/kendo-angular-buttons';
import { LabelComponent } from '@progress/kendo-angular-label';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { FormFieldModule, TextBoxComponent } from '@progress/kendo-angular-inputs';
import { TranslocoPipe } from '@jsverse/transloco';
import { vetIcons } from '@vet/shared';
import { AuthService } from '@vet/backend';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { tap } from 'rxjs';
import { DialogRef, DialogService } from '@progress/kendo-angular-dialog';
import { SVGIconComponent } from '@progress/kendo-angular-icons';
import { RegistrationPhoneVerificationComponent } from '../registration/registration-phone-verification/registration-phone-verification.component';
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
  vetIcons = vetIcons;
  formGroup = this.createFormGroup();
  successDialogContent = viewChild<TemplateRef<unknown>>('successDialogContent');
  dialogRef: DialogRef | null = null;

  private readonly destroyRef = inject(DestroyRef);
  private readonly authService = inject(AuthService);
  private readonly activatedRoute = inject(ActivatedRoute);
  private readonly dialogService = inject(DialogService);
  private readonly router = inject(Router);

  createFormGroup() {
    return new FormGroup({
      code: new FormControl('', Validators.required),
      new_password: new FormControl('', Validators.required),
      repeat_password: new FormControl(
        '',
        Validators.compose([
          Validators.required,
          (control) => {
            const parent = control.parent;

            if (parent && parent.value.new_password === control.value) {
              return null;
            }

            return {
              repeatPasswordInvalid: true,
            };
          },
        ]),
      ),
    });
  }

  getPhoneMask() {
    return this.activatedRoute.snapshot.queryParams['phone'];
  }

  resendCode() {
    const phone = this.activatedRoute.snapshot.queryParams['phone'] ?? '';
    const pid = this.activatedRoute.snapshot.queryParams['pid'] ?? '';

    this.authService
      .initForgetPassword({
        pid: pid,
        phone: phone,
      })
      .pipe(
        tap({
          next: () =>
            this.router.navigate(['password/reset'], {
              queryParams: {
                pid,
                phone,
              },
            }),
        }),
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe();
  }

  onSubmit() {
    if (this.formGroup.invalid) {
      return;
    }

    const { code, new_password } = this.formGroup.value;
    const activateRouteSnapshot = this.activatedRoute.snapshot;
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
            this.dialogRef = this.dialogService.open({
              content: this.successDialogContent(),
              cssClass: 'vet-password-reset-dialog',
            });
          },
        }),
      )
      .subscribe();
  }

  onSuccessDialogClose() {
    if (this.dialogRef) {
      this.dialogRef.close();
    }
  }
}
