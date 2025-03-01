import { ChangeDetectionStrategy, Component, DestroyRef, TemplateRef, viewChild } from '@angular/core';
import { ButtonComponent } from '@progress/kendo-angular-buttons';
import { LabelComponent } from '@progress/kendo-angular-label';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { FormFieldModule, TextBoxComponent } from '@progress/kendo-angular-inputs';
import { TranslocoPipe } from '@jsverse/transloco';
import { ToastModule, ToastService, vetIcons } from '@vet/shared';
import { AuthService } from '@vet/backend';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { tap } from 'rxjs';
import { DialogRef, DialogService } from '@progress/kendo-angular-dialog';
import { SVGIconComponent } from '@progress/kendo-angular-icons';

@Component({
  selector: 'vet-password-reset',
  standalone: true,
  imports: [
    ButtonComponent,
    LabelComponent,
    ReactiveFormsModule,
    TextBoxComponent,
    TranslocoPipe,
    ToastModule,
    FormFieldModule,
    SVGIconComponent,
    RouterLink
  ],
  templateUrl: './password-reset.component.html',
  styleUrl: './password-reset.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PasswordResetComponent {
  vetIcons = vetIcons;
  formGroup = this.createFormGroup();
  successDialogContent = viewChild<TemplateRef<any>>('successDialogContent');
  dialogRef: DialogRef | null = null;

  constructor(
    private destroyRef: DestroyRef,
    private toastService: ToastService,
    private authService: AuthService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private dialogService: DialogService
  ) {
  }

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
              repeatPasswordInvalid: true
            };
          }
        ])
      )
    });
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
        password: new_password?.toString() ?? ''
      })
      .pipe(
        tap({
          next: () => {
            this.dialogRef = this.dialogService.open({
              content: this.successDialogContent(),
              cssClass: 'vet-password-reset-dialog',
            });
          },
          error: (error) => this.toastService.error(error?.error?.error?.message ?? 'auth.failed_to_recover_password')
        })
      )
      .subscribe();
  }

  onSuccessDialogClose() {
    if (this.dialogRef) {
      this.dialogRef.close();
    }
  }
}
