import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  effect,
  inject,
  input,
  OnInit,
  output,
  signal,
} from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { TranslocoPipe } from '@jsverse/transloco';
import { ButtonModule } from '@progress/kendo-angular-buttons';
import { KENDO_DATEINPUTS } from '@progress/kendo-angular-dateinputs';
import { KENDO_DROPDOWNS } from '@progress/kendo-angular-dropdowns';
import { InputsModule, RadioButtonModule } from '@progress/kendo-angular-inputs';
import { LabelModule } from '@progress/kendo-angular-label';
import {
  countries,
  genders,
  useAlertApiErrorHandler,
  useApiErrorConditionalContextFactory,
  useToastApiErrorHandler,
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
  isPersonVerified = signal(false);
  generalForm = input<FormGroup>();
  identityForm = input<
    FormGroup<{
      residential: FormControl<string | null>;
      lastName: FormControl<string | null>;
      personalNumber: FormControl<string | null>;
      firstName: FormControl<string | null>;
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
          // მხოლოდ ვერიფიცირებული პირისთვის რეაგირება
          filter(() => this.isPersonVerified()),
          // დაყოვნება 300 მილიწამით, რომ ავირიდოთ სწრაფი ცვლილებებზე რეაგირება
          debounceTime(300),
          // რეაგირება მხოლოდ მაშინ, როცა მნიშვნელოვანი ველები შეიცვალა
          distinctUntilChanged((prev, curr) => {
            // შევადაროთ მთავარი ველები ვერიფიკაციისთვის
            return prev.personalNumber === curr.personalNumber &&
              prev.lastName === curr.lastName &&
              prev.residential === curr.residential;
          }),
          tap(() => {
            // Reset verification status when form changes
            this.isPersonVerified.set(false);
            this.personVerificationChange.emit(false);

            // Reset phone verification if necessary
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
      this.identityForm()?.markAllAsTouched();
      return;
    }

    this.registerService
      .validatePerson(
        { pid: form?.personalNumber as string, last_name: form?.lastName as string },
        {
          context: this.createApiErrorHandlerContext(),
        },
      )
      .pipe(
        tap({
          next: (personalInfo: User) => {
            this.isPersonVerified.set(true);
            this.switchToGeorgianCitizenship.emit({
              pid: personalInfo.pid || (form?.personalNumber as string),
              firstName: personalInfo.firstName || (form?.firstName as string),
              lastName: personalInfo.lastName || (form?.lastName as string),
              birthDate: personalInfo.birthDate || (form?.dateOfBirth as any),
              gender: personalInfo.gender || (form?.gender as string),
            });
            this.personVerificationChange.emit(true);

            this.onNextClick();
          },
          error: (error) => {
            if (error.error?.error?.can_register === false) {
              this.isPersonVerified.set(false);
              this.personVerificationChange.emit(false);
            } else {
              this.isPersonVerified.set(true);
              this.personVerificationChange.emit(true);
              this.onNextClick();
            }
          },
        }),
      )
      .subscribe();
  }

  onNextClick() {
    if (this.identityForm()?.valid) {
      this.nextClick.emit();
    }
  }
}
