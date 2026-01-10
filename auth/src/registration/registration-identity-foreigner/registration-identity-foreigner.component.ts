import {
  ChangeDetectionStrategy,
  Component,
  computed,
  DestroyRef,
  effect,
  inject,
  input,
  model,
  output,
} from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { TranslocoPipe } from '@jsverse/transloco';
import {
  countries,
  genders,
  SelectOption,
} from '@vet/shared/utils';
import { useAlert, useConfirm } from '@vet/shared/dialogs';
import { DatePickerComponent, InputComponent, SelectorComponent } from '@vet/shared';
import { debounceTime, distinctUntilChanged, filter, tap } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
  selector: 'vet-registration-identity-foreigner',
  imports: [ReactiveFormsModule, TranslocoPipe, InputComponent, SelectorComponent, DatePickerComponent],
  templateUrl: './registration-identity-foreigner.component.html',
  styleUrl: './registration-identity-foreigner.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
})
export class RegistrationIdentityForeignerComponent {
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

  countriesOptions = computed<SelectOption<string>[]>(() => countries.map((c) => ({ label: c.name, value: c.code })));

  gendersOptions = computed<SelectOption<string>[]>(() => genders.map((g) => ({ label: g.name, value: g.code })));
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
}
