import { ChangeDetectionStrategy, Component, DestroyRef, effect, input, OnInit, output, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LabelComponent } from '@progress/kendo-angular-label';
import { TextBoxComponent } from '@progress/kendo-angular-inputs';
import { TranslocoPipe } from '@jsverse/transloco';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { RegistrationPhoneVerificationComponent } from '../registration-phone-verification/registration-phone-verification.component';
import { ButtonComponent } from '@progress/kendo-angular-buttons';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { of, tap } from 'rxjs';
import { SmsService } from '@vet/backend';
import { Reloader, ToastModule, ToastService } from '@vet/shared';

@Component({
    selector: 'vet-registration-phone',
    standalone: true,
    imports: [
        CommonModule,
        ToastModule,
        LabelComponent,
        TextBoxComponent,
        TranslocoPipe,
        ReactiveFormsModule,
        RegistrationPhoneVerificationComponent,
        ButtonComponent,
    ],
    templateUrl: './registration-phone.component.html',
    styleUrl: './registration-phone.component.scss',
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RegistrationPhoneComponent implements OnInit {
    form = input<
        FormGroup<{
            phoneNumber: FormControl<string | null>;
            verificationNumber: FormControl<string | null>;
        }>
    >();
    previousClick = output();
    nextClick = output();

    phase = signal<'initial' | 'verifying' | 'success'>('initial');
    verificationCodeReloader = new Reloader();

    constructor(
        private destroyRef: DestroyRef,
        private smsService: SmsService,
        private toastService: ToastService,
    ) {
        effect(() => {
            const form = this.form();

            if (!form) {
                return;
            }

            form.controls.phoneNumber.valueChanges
                .pipe(
                    tap(() => this.phase.set('initial')),
                    tap(() => form.controls.verificationNumber.setValue('')),
                    takeUntilDestroyed(this.destroyRef),
                )
                .subscribe();
        });
    }

    ngOnInit() {
        this.verificationCodeReloader
            .reloadable(() => {
                const form = this.form();
                if (!form || !form.controls.phoneNumber.valid) {
                    return of();
                }

                return this.smsService.sendSmsCode({
                    phone: form.value.phoneNumber ?? '',
                });
            })
            .pipe(takeUntilDestroyed(this.destroyRef))
            .subscribe();
    }

    onSend() {
        this.verificationCodeReloader.reload();
    }

    onPreviousClick() {
        this.previousClick.emit();
    }

    onNextClick() {
        const form = this.form();

        if (!form) {
            return;
        }

        switch (this.phase()) {
            case 'initial':
                this.phase.set('verifying');
                this.onSend();
                break;

            default:
                if (!form.valid) {
                    return;
                }

                const { phoneNumber, verificationNumber } = form.value;

                this.smsService
                    .validateSms({
                        phone: phoneNumber ?? '',
                        sms_code: verificationNumber ?? '',
                    })
                    .pipe(
                        tap({
                            next: () => this.nextClick.emit(),
                        }),
                    )
                    .subscribe();
                break;
        }
    }
}
