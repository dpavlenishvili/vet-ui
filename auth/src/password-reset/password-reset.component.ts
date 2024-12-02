import { ChangeDetectionStrategy, Component, DestroyRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ButtonComponent } from '@progress/kendo-angular-buttons';
import { LabelComponent } from '@progress/kendo-angular-label';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { FormFieldModule, TextBoxComponent } from '@progress/kendo-angular-inputs';
import { TranslocoPipe } from '@jsverse/transloco';
import { ToastModule, ToastService } from '@vet/shared';
import { AuthService } from '@vet/backend';
import { ActivatedRoute, Router } from '@angular/router';
import { tap } from 'rxjs';

@Component({
    selector: 'vet-password-reset',
    standalone: true,
    imports: [
        CommonModule,
        ButtonComponent,
        LabelComponent,
        ReactiveFormsModule,
        TextBoxComponent,
        TranslocoPipe,
        ToastModule,
        FormFieldModule,
    ],
    templateUrl: './password-reset.component.html',
    styleUrl: './password-reset.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PasswordResetComponent {
    formGroup = this.createFormGroup();

    constructor(
        private destroyRef: DestroyRef,
        private toastService: ToastService,
        private authService: AuthService,
        private router: Router,
        private activatedRoute: ActivatedRoute,
    ) {}

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
                        this.toastService.success('auth.password_successfully_changed');
                        void this.router.navigate(['password/recovery']);
                    },
                    error: (error) =>
                        this.toastService.error(error?.error?.error?.message ?? 'auth.failed_to_recover_password'),
                }),
            )
            .subscribe();
    }
}
