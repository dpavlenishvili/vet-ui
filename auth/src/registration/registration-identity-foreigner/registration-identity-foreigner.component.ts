import { ChangeDetectionStrategy, Component, inject, input, OnInit, output, signal } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { TranslocoPipe } from '@jsverse/transloco';
import { ButtonModule } from '@progress/kendo-angular-buttons';
import { KENDO_DATEINPUTS } from '@progress/kendo-angular-dateinputs';
import { KENDO_DROPDOWNS } from '@progress/kendo-angular-dropdowns';
import { InputsModule, RadioButtonModule } from '@progress/kendo-angular-inputs';
import { LabelModule } from '@progress/kendo-angular-label';
import {
  Citizenship,
  countries,
  genders,
  useAlertApiErrorHandler,
  useApiErrorConditionalContextFactory,
  useToastApiErrorHandler,
} from '@vet/shared';
import { tap } from 'rxjs';
import { RegisterService, User } from '@vet/backend';
import { Router } from '@angular/router';

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
export class RegistrationIdentityForeignerComponent implements OnInit {
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
      lastname: FormControl<string | null>;
      personalNumber: FormControl<string | null>;
      firstname: FormControl<string | null>;
      dateOfBirth: FormControl<Date | null>;
      gender: FormControl<string | null>;
    }>
  >();
  countries = countries;
  genders = genders;
  previousClick = output();
  nextClick = output();
  personVerificationChange = output<boolean>();

  registerService = inject(RegisterService);
  router = inject(Router);

  private lastVerifiedForm: {
    pid?: string | null;
    lastname?: string | null;
    firstname?: string | null;
    dateOfBirth?: Date | null;
    gender?: string | null;
    residential?: string | null;
  } = {};

  ngOnInit(): void {
    this.isPersonVerified.set(this.identityForm()?.valid as boolean);
    this.identityForm()?.valueChanges.subscribe((value) => {
      if (this.isPersonVerified()) {
        const currentForm = {
          pid: value.personalNumber,
          lastname: value.lastname,
          firstname: value.firstname,
          dateOfBirth: value.dateOfBirth,
          gender: value.gender,
          residential: value.residential,
        };

        const fieldsChanged =
          this.lastVerifiedForm.pid !== currentForm.pid || this.lastVerifiedForm.lastname !== currentForm.lastname;

        if (fieldsChanged) {
          this.isPersonVerified.set(false);
          this.personVerificationChange.emit(false);

          if (this.generalForm()?.controls?.['phone']?.value.phoneNumber) {
            this.generalForm()?.controls?.['phone'].reset();
          }
        }
      }
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

    if (
      this.isPersonVerified() &&
      this.lastVerifiedForm.pid === form?.personalNumber &&
      this.lastVerifiedForm.lastname === form?.lastname
    ) {
      this.onNextClick();
      return;
    }

    this.registerService
      .validatePerson(
        { pid: form?.personalNumber as string, last_name: form?.lastname as string },
        {
          context: this.createApiErrorHandlerContext(),
        },
      )
      .pipe(
        tap({
          next: (personalInfo: User) => {
            this.isPersonVerified.set(true);
            this.personVerificationChange.emit(true);

            this.lastVerifiedForm = {
              pid: form?.personalNumber,
              lastname: form?.lastname,
              firstname: personalInfo.firstName ?? null,
              dateOfBirth: personalInfo.birthDate ? new Date(personalInfo.birthDate) : null,
              gender: personalInfo.gender ?? null,
              residential: 'GEO',
            };

            this.identityForm()?.controls.firstname.setValue(personalInfo.firstName ?? null);
            this.identityForm()?.controls.dateOfBirth.setValue(
              personalInfo.birthDate ? new Date(personalInfo.birthDate) : null,
            );
            this.identityForm()?.controls.firstname.setValue(personalInfo.firstName ?? null);
            this.identityForm()?.controls.gender.setValue(personalInfo.gender ?? null);
            this.identityForm()?.controls.residential.setValue('GEO');
            this.generalForm()?.get('chooseCitizenship')?.patchValue({
              citizenship: Citizenship.Georgian,
            });
          },
          error: () => {
            if (this.identityForm()?.valid) {
              this.isPersonVerified.set(true);
              this.personVerificationChange.emit(true);

              this.lastVerifiedForm = {
                pid: form?.personalNumber,
                lastname: form?.lastname,
                firstname: form?.firstname,
                dateOfBirth: form?.dateOfBirth,
                gender: form?.gender,
                residential: form?.residential,
              };

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
