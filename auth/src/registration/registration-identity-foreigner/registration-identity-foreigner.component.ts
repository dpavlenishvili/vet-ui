import { ChangeDetectionStrategy, Component, DestroyRef, effect, inject, input, model, output } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { TranslocoPipe } from '@jsverse/transloco';
import { ButtonModule } from '@progress/kendo-angular-buttons';
import { KENDO_DATEINPUTS } from '@progress/kendo-angular-dateinputs';
import { KENDO_DROPDOWNS } from '@progress/kendo-angular-dropdowns';
import { InputsModule, RadioButtonModule } from '@progress/kendo-angular-inputs';
import { LabelModule } from '@progress/kendo-angular-label';
import {
  countries,
  genders,
  useAlert,
  useAlertApiErrorHandler,
  useApiErrorConditionalContextFactory,
  useConfirm,
  useToastApiErrorHandler,
  englishLettersValidator,
} from '@vet/shared';
import { debounceTime, distinctUntilChanged, filter, tap } from 'rxjs';
import { RegisterService, User } from '@vet/backend';
import { Router } from '@angular/router';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
  selector: 'vet-registration-identity-foreigner',
  imports: [
    ReactiveFormsModule,
    InputsModule,
    RadioButtonModule,
    ButtonModule,
    LabelModule,
    TranslocoPipe,
    KENDO_DATEINPUTS,
    KENDO_DROPDOWNS,
  ],
  templateUrl: './registration-identity-foreigner.component.html',
  styleUrl: './registration-identity-foreigner.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
})
export class RegistrationIdentityForeignerComponent {
  createApiErrorHandlerContext = useApiErrorConditionalContextFactory({
    when: ({ code }) => code === 1009,
    then: useAlertApiErrorHandler(),
    else: useToastApiErrorHandler(),
  });

  alert = useAlert();
  confirm = useConfirm();

  isPersonVerified = model(false);
  generalForm = input<FormGroup>();
  identityForm = input<
    FormGroup<{
      residential: FormControl<string | null>;
      lastName: FormControl<string | null>;
      personalNumber: FormControl<string | null>;
      firstName: FormControl<string | null>;
      firstNameEn: FormControl<string | null>;
      lastNameEn: FormControl<string | null>;
      dateOfBirth: FormControl<Date | null>;
      gender: FormControl<string | null>;
    }>
  >();
  countries = countries;
  genders = genders;
  previousClick = output();
  nextClick = output();
  personVerificationChange = output<boolean>();
  switchToGeorgianCitizenship = output<User>();
  resetForm = output<void>();

  registerService = inject(RegisterService);
  router = inject(Router);

  constructor(private destroyRef: DestroyRef) {
    effect(() => {
      const identityForm = this.identityForm();

      if (!identityForm) {
        return;
      }

      identityForm.valueChanges
        .pipe(
          filter(() => this.isPersonVerified()),
          debounceTime(300),
          distinctUntilChanged((prev, curr) => {
            // ყველა მთავარი ველის შემოწმება რომ თავიდან გადამოწმება მოხდეს
            return (
              prev.personalNumber === curr.personalNumber &&
              prev.lastName === curr.lastName &&
              prev.residential === curr.residential &&
              prev.firstName === curr.firstName &&
              prev.firstNameEn === curr.firstNameEn &&
              prev.lastNameEn === curr.lastNameEn &&
              prev.dateOfBirth === curr.dateOfBirth &&
              prev.gender === curr.gender
            );
          }),
          tap(() => {
            this.isPersonVerified.set(false);
            this.personVerificationChange.emit(false);

            if (this.generalForm()?.controls?.['phone']?.value.phoneNumber) {
              this.generalForm()?.controls?.['phone'].reset();
            }
          }),
          takeUntilDestroyed(this.destroyRef),
        )
        .subscribe();
    });
  }

  onPreviousClick() {
    this.previousClick.emit();
  }

  onCheckClick() {
    this.identityForm()?.markAllAsTouched();

    const form = this.identityForm()?.value;

    if (this.identityForm()?.invalid) {
      const errors = this.identityForm()?.errors || {};
      const errorKeys = Object.keys(errors);
      const hasOnlyPersonNotVerifiedError = errorKeys.length === 1 && errors['personNotVerified'];

      if (!hasOnlyPersonNotVerifiedError) {
        this.identityForm()?.markAllAsTouched();
        return;
      }
    }

    if (this.isPersonVerified() && this.identityForm()?.valid) {
      this.nextClick.emit();
      return;
    }

    this.registerService
      .validatePerson(
        {
          pid: form?.personalNumber as string,
          last_name: form?.lastName as string,
          residential: form?.residential as string,
        },
        {
          context: this.createApiErrorHandlerContext(),
        },
      )
      .pipe(
        tap({
          next: (personalInfo: User) => {
            if (personalInfo.firstName) {
              const title = 'auth.citizenship_auto_update_confirm';

              this.confirm.show({
                title,
                onConfirm: () => {
                  this.isPersonVerified.set(true);
                  this.switchToGeorgianCitizenship.emit({
                    pid: personalInfo.pid || (form?.personalNumber as string),
                    firstName: personalInfo.firstName || (form?.firstName as string),
                    lastName: personalInfo.lastName || (form?.lastName as string),
                    birthDate: personalInfo.birthDate || (form?.dateOfBirth as unknown as string),
                    gender: personalInfo.gender || (form?.gender as string),
                  });
                  this.personVerificationChange.emit(true);
                  this.onNextClick();
                },
                onDismiss: () => {
                  this.isPersonVerified.set(false);
                  this.personVerificationChange.emit(false);
                  this.resetForm.emit();
                  this.router.navigate(['/registration', 'citizenship_selection']);
                },
              });
            } else {
              this.isPersonVerified.set(true);
              this.personVerificationChange.emit(true);
              this.onNextClick();
            }
          },
          error: (error) => {
            this.isPersonVerified.set(false);
            this.personVerificationChange.emit(false);

            const errorMessage = error?.error?.error?.message || 'auth.person_validation_failed';
            this.alert.show({
              variant: 'warning',
              text: errorMessage,
            });
          },
        }),
      )
      .subscribe();
  }

  onNextClick() {
    if (this.isPersonVerified() && this.identityForm()?.valid) {
      this.nextClick.emit();
    }
  }
}
