import { ChangeDetectionStrategy, Component, DestroyRef, effect, inject, input, model, output } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { TranslocoPipe } from '@jsverse/transloco';
import { debounceTime, distinctUntilChanged, filter, tap } from 'rxjs';
import { useAlert } from '@vet/shared/dialogs';
import { DatePickerComponent, InputComponent, ToastModule } from '@vet/shared';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
  selector: 'vet-registration-identity-citizen',
  imports: [ReactiveFormsModule, TranslocoPipe, InputComponent, DatePickerComponent, ToastModule],
  templateUrl: './registration-identity-citizen.component.html',
  styleUrl: './registration-identity-citizen.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
})
export class RegistrationIdentityCitizenComponent {
  alert = useAlert();

  generalForm = input<FormGroup>();
  identityForm = input<
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
  personVerificationChange = output<boolean>();

  private destroyRef = inject(DestroyRef);

  constructor() {
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
            return prev.personalNumber === curr.personalNumber && prev.lastName === curr.lastName;
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
}
