import { ChangeDetectionStrategy, Component, DestroyRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LabelComponent } from '@progress/kendo-angular-label';
import { TextBoxComponent } from '@progress/kendo-angular-inputs';
import { TranslocoPipe } from '@jsverse/transloco';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ButtonComponent } from '@progress/kendo-angular-buttons';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '@vet/backend';
import { ToastModule, ToastService } from '@vet/shared';
import { tap } from 'rxjs';

@Component({
  selector: 'vet-password-forgot',
  imports: [
    CommonModule,
    LabelComponent,
    TextBoxComponent,
    TranslocoPipe,
    ReactiveFormsModule,
    ButtonComponent,
    RouterLink,
    ToastModule,
  ],
  templateUrl: './password-forgot.component.html',
  styleUrl: './password-forgot.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PasswordForgotComponent {
  formGroup = this.createFormGroup();

  constructor(
    private destroyRef: DestroyRef,
    private toastService: ToastService,
    private authService: AuthService,
    private router: Router,
  ) {}

  createFormGroup() {
    return new FormGroup({
      pid: new FormControl('', Validators.required),
      phone: new FormControl('', Validators.required),
    });
  }

  onSubmit() {
    if (this.formGroup.invalid) {
      return;
    }

    const { pid, phone } = this.formGroup.value;
    this.authService
      .initForgetPassword({
        pid: pid?.toString() ?? '',
        phone: phone?.toString() ?? '',
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
          error: (error) => this.toastService.error(error?.error?.error?.message ?? 'auth.failed_to_recover_password'),
        }),
      )
      .subscribe();
  }
}
