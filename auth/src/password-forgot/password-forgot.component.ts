import { ChangeDetectionStrategy, Component } from '@angular/core';
import { LabelComponent } from '@progress/kendo-angular-label';
import { TextBoxModule } from '@progress/kendo-angular-inputs';
import { TranslocoPipe } from '@jsverse/transloco';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ButtonComponent } from '@progress/kendo-angular-buttons';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '@vet/backend';
import { ToastModule } from '@vet/shared';
import { tap } from 'rxjs';
import { KENDO_SVGICON } from '@progress/kendo-angular-icons';
import { vetIcons } from '@vet/shared';
import { KENDO_TOOLTIP } from '@progress/kendo-angular-tooltip';

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
    KENDO_TOOLTIP
  ],
  templateUrl: './password-forgot.component.html',
  styleUrl: './password-forgot.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
})
export class PasswordForgotComponent {
  formGroup = this.createFormGroup();
  vetIcons = vetIcons;

  constructor(
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
        }),
      )
      .subscribe();
  }
}
