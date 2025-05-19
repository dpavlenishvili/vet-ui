import {
  ChangeDetectionStrategy,
  Component,
  computed,
  DestroyRef,
  effect,
  input,
  model,
  output,
  signal,
} from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { TranslocoPipe } from '@jsverse/transloco';
import { ButtonModule } from '@progress/kendo-angular-buttons';
import { InputsModule, RadioButtonModule } from '@progress/kendo-angular-inputs';
import { LabelModule } from '@progress/kendo-angular-label';
import { KENDO_DATEINPUTS } from '@progress/kendo-angular-dateinputs';
import { RegisterService, type User } from '@vet/backend';
import { debounceTime, distinctUntilChanged, filter, tap } from 'rxjs';
import {
  ToastModule,
  useAlertApiErrorHandler,
  useApiErrorConditionalContextFactory,
  useToastApiErrorHandler,
} from '@vet/shared';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
  selector: 'vet-registration-identity-citizen',
  imports: [
    ReactiveFormsModule,
    InputsModule,
    RadioButtonModule,
    ButtonModule,
    LabelModule,
    TranslocoPipe,
    KENDO_DATEINPUTS,
    ToastModule,
  ],
  templateUrl: './registration-identity-citizen.component.html',
  styleUrl: './registration-identity-citizen.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
})
export class RegistrationIdentityCitizenComponent {
  createApiErrorHandlerContext = useApiErrorConditionalContextFactory({
    when: ({ code }) => code === 1009,
    then: useAlertApiErrorHandler(),
    else: useToastApiErrorHandler(),
  });

  form = input<
    FormGroup<{
      personalNumber: FormControl<string | null>;
      lastName: FormControl<string | null>;
      firstName: FormControl<string | null>;
      dateOfBirth: FormControl<Date | null>;
      gender: FormControl<string | null>;
    }>
  >();
  gender = ['male', 'female'];
  isPersonVerified = model(false);
  previousClick = output();
  nextClick = output();
  personVerificationChange = output<boolean>();

  constructor(
    private registerService: RegisterService,
    private destroyRef: DestroyRef,
  ) {
    effect(() => {
      const form = this.form();

      if (!form) {
        return;
      }

      form.valueChanges
        .pipe(
          // მხოლოდ ვერიფიცირებული პირისთვის რეაგირება
          filter(() => this.isPersonVerified()),
          // დაყოვნება 300 მილიწამით, რომ ავირიდოთ სწრაფი ცვლილებებზე რეაგირება
          debounceTime(300),
          // რეაგირება მხოლოდ მაშინ, როცა ფორმა რეალურად შეიცვალა
          distinctUntilChanged((prev, curr) => {
            // შევადაროთ მთავარი ველები ვერიფიკაციისთვის
            return prev.personalNumber === curr.personalNumber && prev.lastName === curr.lastName;
          }),
          tap(() => {
            this.isPersonVerified.set(false);
            this.personVerificationChange.emit(false);
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
    this.form()?.markAllAsTouched();

    const form = this.form()?.value;

    if (this.form()?.invalid) {
      this.form()?.markAllAsTouched();
      return;
    }

    const currentPID = form?.personalNumber as string;
    const currentLastname = form?.lastName as string;

    if (this.isPersonVerified()) {
      this.nextClick.emit();
      return;
    }

    this.registerService
      .validatePerson(
        { pid: currentPID, last_name: currentLastname },
        {
          context: this.createApiErrorHandlerContext(),
        },
      )
      .pipe(
        tap({
          next: (personalInfo: User) => {
            this.isPersonVerified.set(true);

            this.form()?.controls.firstName.setValue(personalInfo.firstName ?? null, { emitEvent: false });
            this.form()?.controls.dateOfBirth.setValue(
              personalInfo.birthDate ? new Date(personalInfo.birthDate) : null,
              { emitEvent: false },
            );
            this.form()?.controls.gender.setValue(personalInfo.gender ?? null, { emitEvent: false });

            this.personVerificationChange.emit(true);
          },
          error: () => {
            this.isPersonVerified.set(false);
            this.personVerificationChange.emit(false);
          },
        }),
      )
      .subscribe();
  }

  onNextClick() {
    if (!this.isPersonVerified()) {
      // If not verified, attempt verification first
      this.onCheckClick();
    } else {
      this.nextClick.emit();
    }
  }
}
